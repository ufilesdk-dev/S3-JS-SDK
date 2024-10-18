import React, { useState } from 'react';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function UploadFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [bucketName, setBucketName] = useState("");  // 新增存储桶名称状态
    const [keyName, setKeyName] = useState("");  // 新增Key名称状态
    const [storageClass, setStorageClass] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileInput = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile || !bucketName || !keyName) {
            setUploadStatus("请输入桶名，文件，和文件名");
            return;
        }

        const params = {
            Bucket: bucketName,  // 动态设置存储桶名称
            Key: keyName,  // 使用输入的Key名称
            Body: selectedFile,
        };
        if (storageClass) {
            params.StorageClass = storageClass;
        }

        try {
            const command = new PutObjectCommand(params);
            const response = await s3.send(command);
            console.log("文件上传成功：", response);
            setUploadStatus("文件上传成功!");
            setTimeout(() => {
                setUploadStatus("");
            }, 3000);
        } catch (err) {
            console.error("文件上传失败：", err);
            setUploadStatus("文件上传失败");
            setTimeout(() => {
                setUploadStatus("");
            }, 3000);
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

            <h2>文件上传</h2>
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
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
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
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Storage Class (optional)"
                    value={storageClass}
                    onChange={(e) => setStorageClass(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleUpload} className="btn btn-primary">上传文件</button>
            <p>{uploadStatus}</p>
        </div>
    );
}

export default UploadFile;
