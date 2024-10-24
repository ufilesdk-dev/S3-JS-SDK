import React, { useState } from 'react';
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function ListObjects() {
    const [bucketName, setBucketName] = useState("");
    const [maxKeys, setMaxKeys] = useState(10);  // 默认查找10个对象
    const [objects, setObjects] = useState([]);
    const [status, setStatus] = useState("");

    const handleListObjects = async () => {
        if (!bucketName) {
            setStatus("请提供有效的桶名称");
            return;
        }

        try {
            const command = new ListObjectsV2Command({
                Bucket: bucketName,
                MaxKeys: maxKeys > 0 ? maxKeys : 10,
            });

            let isTruncated = true;
            let continuationToken;
            let allObjects = [];

            while (isTruncated && allObjects.length < maxKeys) {
                const params = { ...command.input };
                if (continuationToken) {
                    params.ContinuationToken = continuationToken;
                }

                const response = await s3.send(new ListObjectsV2Command(params));
                if (response.Contents) {
                    allObjects = [...allObjects, ...response.Contents];
                }

                if (allObjects.length >= maxKeys) {
                    allObjects = allObjects.slice(0, maxKeys);
                    isTruncated = false;
                } else {
                    isTruncated = response.IsTruncated;
                    continuationToken = response.NextContinuationToken;
                }
            }

            setObjects(allObjects);
            setStatus(`成功查找到 ${allObjects.length} 个对象`);

        } catch (err) {
            console.error("查找对象错误：", err);
            setStatus("查找对象错误");
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
            <h2>获取 S3 桶内对象列表</h2>
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
                    type="number"
                    placeholder="Max Keys"
                    value={maxKeys}
                    onChange={(e) => setMaxKeys(parseInt(e.target.value, 10))}
                    className="form-control"
                />
            </div>
            <button onClick={handleListObjects} className="btn btn-primary">查找对象</button>
            <p className="mt-3">{status}</p>
            {objects.length > 0 && (
                <div className="mt-4">
                    <h3>对象列表:</h3>
                    <ul className="list-group">
                        {objects.map((obj, index) => (
                            <li key={index} className="list-group-item">
                                {obj.Key} ({obj.Size} bytes)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ListObjects;
