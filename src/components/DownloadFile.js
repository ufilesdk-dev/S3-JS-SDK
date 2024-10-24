import React, { useState } from 'react';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function DownloadFile() {
    const [bucketName, setBucketName] = useState("");
    const [keyName, setKeyName] = useState("");
    const [downloadStatus, setDownloadStatus] = useState("");

    const handleDownload = async () => {
        if (!bucketName || !keyName) {
            setDownloadStatus("请输入桶名和文件名");
            setTimeout(() => {
                setDownloadStatus("");
            }, 3000);
            return;
        }

        const params = {
            Bucket: bucketName,
            Key: keyName
        };

        try {
            const command = new GetObjectCommand(params);
            const response = await s3.send(command);

            // 将 ReadableStream 转换为 Blob
            const blob = await streamToBlob(response.Body);
            console.log("下载文件大小:", blob.size);

            // 创建下载链接
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', keyName); // 指定下载文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadStatus("下载文件成功!");
            setTimeout(() => {
                setDownloadStatus("");
            }, 3000);
        } catch (err) {
            console.error("下载文件失败：", err);
            setDownloadStatus("下载文件失败");
            setTimeout(() => {
                setDownloadStatus("");
            }, 3000);
        }
    };

    // 辅助函数：将 ReadableStream 转换为 Blob
    const streamToBlob = async (stream) => {
        const chunks = [];
        const reader = stream.getReader();
        let done, value;
        while (!done) {
            ({ done, value } = await reader.read());
            if (value) {
                chunks.push(value);
            }
        }
        return new Blob(chunks);
    };

    return (
        <div>
            <style>
                {`
                .form-group {
                    margin-bottom: 20px; /* 将间距设置为 20px */
                }
                `}
            </style>

            <h2>文件下载</h2>
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
            <button onClick={handleDownload} className="btn btn-primary">下载文件</button>
            <p>{downloadStatus}</p>
        </div>
    );
}

export default DownloadFile;
