import React, { useState } from 'react';
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function GetObjectAttr() {
    const [bucketName, setBucketName] = useState("");
    const [keyName, setKeyName] = useState("");
    const [attributes, setAttributes] = useState(null);
    const [status, setStatus] = useState("");

    const handleGetAttributes = async () => {
        const params = {
            Bucket: bucketName,
            Key: keyName,
        };

        try {
            const command = new HeadObjectCommand(params);
            const response = await s3.send(command);
            setAttributes({
                ContentLength: response.ContentLength,
                LastModified: response.LastModified,
                ETag: response.ETag,
                ContentType: response.ContentType,
            });
            setStatus("获取对象元数据信息成功!");
            setTimeout(() => {
                setStatus("");
            }, 3000);
        } catch (err) {
            console.error("获取对象元数据信息失败:", err);
            setStatus("获取对象元数据信息失败");
            setTimeout(() => {
                setStatus("");
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
            <h2>获取对象元数据信息</h2>
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
            <button onClick={handleGetAttributes} className="btn btn-primary">获取元数据</button>
            <p className="mt-3">{status}</p>
            {attributes && (
                <div className="mt-4">
                    <h3>Attributes:</h3>
                    <ul className="list-group">
                        <li className="list-group-item">Size: {attributes.ContentLength} bytes</li>
                        <li className="list-group-item">Last Modified: {attributes.LastModified?.toString()}</li>
                        <li className="list-group-item">ETag: {attributes.ETag}</li>
                        <li className="list-group-item">Content Type: {attributes.ContentType}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GetObjectAttr;
