import React, { useState } from 'react';
import { DeleteObjectsCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function DeleteObjects() {
    const [bucketName, setBucketName] = useState("");
    const [objectKeys, setObjectKeys] = useState("");
    const [deleteStatus, setDeleteStatus] = useState("");

    const checkObjectExists = async (key) => {
        try {
            await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
            return true;
        } catch (err) {
            if (err.name === 'NotFound') {
                return false;
            } else {
                throw err;
            }
        }
    };

    const handleDelete = async () => {
        const keysArray = objectKeys.split(",").map(key => key.trim());

        try {
            const existingKeys = [];
            for (const key of keysArray) {
                const exists = await checkObjectExists(key);
                if (exists) {
                    existingKeys.push({ Key: key });
                }
            }

            if (existingKeys.length === 0) {
                setDeleteStatus("没有找到可删除的对象");
                setTimeout(() => {
                    setDeleteStatus("");
                }, 3000);
                return;
            }

            const deleteParams = {
                Bucket: bucketName,
                Delete: {
                    Objects: existingKeys,
                },
            };

            const command = new DeleteObjectsCommand(deleteParams);
            const response = await s3.send(command);
            setDeleteStatus(`成功删除 ${response.Deleted.length} 个对象. 删除对象: ${response.Deleted.map(d => d.Key).join(", ")}`);
            setTimeout(() => {
                setDeleteStatus("");
            }, 3000);
        } catch (err) {
            console.error("删除文件失败:", err);
            setDeleteStatus("删除对象失败");
            setTimeout(() => {
                setDeleteStatus("");
            }, 3000);
        }
    };

    return (
        <div>
            <style>
                {`
                .form-group {
                    margin-bottom: 20px; /* 设置输入框之间的间距 */
                }
                `}
            </style>
            <h2>文件删除</h2>
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
                <textarea
                    placeholder="object key1, object key2,..."
                    value={objectKeys}
                    onChange={(e) => setObjectKeys(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleDelete} className="btn btn-danger">执行删除</button>
            <p>{deleteStatus}</p>
        </div>
    );
}

export default DeleteObjects;
