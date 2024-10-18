import React, { useState } from 'react';
import { GetObjectAclCommand } from "@aws-sdk/client-s3";
import s3 from '../utils/s3Client';

function GetObjectAcl() {
    const [bucketName, setBucketName] = useState("");
    const [keyName, setKeyName] = useState("");
    const [aclInfo, setAclInfo] = useState(null);
    const [status, setStatus] = useState("");

    const handleGetAcl = async () => {
        const params = {
            Bucket: bucketName,
            Key: keyName,
        };

        try {
            const command = new GetObjectAclCommand(params);
            const response = await s3.send(command);
            setAclInfo(response.Grants);
            setStatus("获取控制访问权限信息成功!");
            // 设置3秒后清除提示信息
            setTimeout(() => {
                setStatus("");
            }, 3000);
        } catch (err) {
            console.error("获取控制访问权限信息失败:", err);
            setStatus("获取控制访问权限信息失败");
            // 设置3秒后清除提示信息
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
            <h2>获取对象访问控制权限信息</h2>
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
            <button onClick={handleGetAcl} className="btn btn-primary">获取权限信息</button>
            <p className="mt-3">{status}</p>
            {aclInfo && (
                <div className="mt-4">
                    <h3>ACL Information:</h3>
                    <ul className="list-group">
                        {aclInfo.map((grant, index) => (
                            <li key={index} className="list-group-item">
                                Grantee: {grant.Grantee.DisplayName || grant.Grantee.URI || "Unknown"} -
                                Permission: {grant.Permission}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GetObjectAcl;
