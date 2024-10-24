import React, { useState } from 'react';
import { CopyObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function UpdateStorageClass() {
    const [bucketName, setBucketName] = useState("");
    const [keyName, setKeyName] = useState("");
    const [storageClass, setStorageClass] = useState("");
    const [updateStatus, setUpdateStatus] = useState("");

    const handleUpdate = async () => {
        if (!bucketName || !keyName || !storageClass) {
            setUpdateStatus("请填写所有字段");
            setTimeout(() => {
                setUpdateStatus("");
            }, 3000);
            return;
        }

        const copySource = `${bucketName}/${keyName}`;
        const params = {
            Bucket: bucketName,
            CopySource: copySource,
            Key: keyName,
            StorageClass: storageClass,
            MetadataDirective: 'COPY'
        };

        try {
            const command = new CopyObjectCommand(params);
            const response = await s3.send(command);
            console.log("存储类型更新成功：", response);
            setUpdateStatus("存储类型更新成功!");
            // 设置3秒后清除提示信息
            setTimeout(() => {
                setUpdateStatus("");
            }, 3000);
        } catch (err) {
            console.error("存储类型更新失败：", err);
            setUpdateStatus("存储类型更新失败");
            setTimeout(() => {
                setUpdateStatus("");
            }, 3000);
        }
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

            <h2>更新存储类型</h2>
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
                    type="text"
                    placeholder="Storage Class"
                    value={storageClass}
                    onChange={(e) => setStorageClass(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleUpdate} className="btn btn-primary">执行更新</button>
            <p>{updateStatus}</p>
        </div>
    );
}

export default UpdateStorageClass;
