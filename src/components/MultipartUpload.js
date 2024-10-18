import React, { useState } from 'react';
import {
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand
} from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';
import CryptoJS from 'crypto-js';

function MultipartUpload() {
    const [bucketName, setBucketName] = useState("");
    const [key, setKey] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileInput = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const calculateMD5 = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer(); // 将 Blob 转换为 ArrayBuffer
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        return CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Base64);
    };

    const sliceUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("请选择文件上传");
            return;
        }

        const partSize = 8 * 1024 * 1024; // 8MB
        const numParts = Math.ceil(selectedFile.size / partSize);
        let uploadId;

        try {
            // 创建分片上传任务
            const createMultipartUploadResponse = await s3.send(
                new CreateMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: key,
                })
            );

            uploadId = createMultipartUploadResponse.UploadId;
            const uploadPromises = [];
            setUploadStatus("开始创建分片请求...");
            // 设置3秒后清除提示信息
            setTimeout(() => {
                setUploadStatus("");
            }, 3000);

            for (let partNumber = 1; partNumber <= numParts; partNumber++) {
                const start = (partNumber - 1) * partSize;
                const end = Math.min(start + partSize, selectedFile.size);
                const filePart = selectedFile.slice(start, end);

                const md5Hash = await calculateMD5(filePart);

                const uploadPartCommand = new UploadPartCommand({
                    Bucket: bucketName,
                    Key: key,
                    UploadId: uploadId,
                    PartNumber: partNumber,
                    Body: filePart,
                    ContentMD5: md5Hash,
                });

                uploadPromises.push(
                    s3.send(uploadPartCommand).then((uploadPartResponse) => ({
                        ETag: uploadPartResponse.ETag,
                        PartNumber: partNumber,
                    }))
                );
            }

            const uploadedParts = await Promise.all(uploadPromises);

            uploadedParts.forEach((part) => {
                if (!part.ETag) {
                    throw new Error(`Part ${part.PartNumber} 上传失败`);
                }
            });

            // 完成分片上传
            await s3.send(
                new CompleteMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: key,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: uploadedParts,
                    },
                })
            );

            setUploadStatus(`成功上传 ${key} 到 ${bucketName}`);
            setTimeout(() => {
                setUploadStatus("");
            }, 5000);
        } catch (error) {
            console.error("上传文件失败:", error);
            setUploadStatus("上传文件失败");
            setTimeout(() => {
                setUploadStatus("");
            }, 5000);

            if (uploadId) {
                // 如果上传失败，中止上传
                await s3.send(
                    new AbortMultipartUploadCommand({
                        Bucket: bucketName,
                        Key: key,
                        UploadId: uploadId,
                    })
                );
            }
        }
    };

    return (
        <div>
            <style>
                {`
                .form-group {
                    margin-bottom: 20px; 
                }
                `}
            </style>
            <h2>分片上传</h2>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Bucket Name"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Key Name"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="file"
                    onChange={handleFileInput}
                    className="form-control"
                />
            </div>
            <button onClick={sliceUpload} className="btn btn-primary">执行上传</button>
            <p className="mt-3">{uploadStatus}</p>
        </div>
    );
}

export default MultipartUpload;
