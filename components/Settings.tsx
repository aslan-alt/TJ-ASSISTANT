import { ExcelRenderer } from 'react-excel-renderer';
import {Table, type TableColumnsType } from "antd";
import {getAccounts, saveAccounts} from "~utils/indexedDB";
import {useEffect, useState} from "react";
import styled from "styled-components";



export type AccountItem = {
  email?: string;
  password?: string;
  displayName?: string;
  role?: string;
  userId?: string;
  teamName?: string;
  TeamId?: string;
  notes?:string
}

export const Settings = ()=> {
    const [accounts, setAccounts] = useState<AccountItem[]>([])


    const handleFile = (event) => {
        const fileObj = event.target.files[0];

        ExcelRenderer(fileObj, async(err, resp) => {
            if (err) {
                console.log(err);
            } else {

                const accountsFromExcel = resp.rows.slice(1).filter((row) => {
                    return row?.[0]
                }).map(item=>({
                    email: item?.[0],
                    password: item?.[1],
                    displayName: item?.[2],
                    role: item?.[3],
                    userId: item?.[4],
                    teamName:item?.[5],
                    TeamId:item?.[6],
                    notes:item?.[7],
                }))
                try {
                    await saveAccounts(accountsFromExcel);
                    console.log("Accounts saved successfully");
                    setAccounts(accountsFromExcel)
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    useEffect(()=>{
        if(!accounts?.length){
            getAccounts().then(res=>{
                setAccounts(res as AccountItem[]);
            })
        }

    },[])

    const columns: TableColumnsType<AccountItem> = [
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: () => <a>Delete</a>,
        },
    ];

    const data: AccountItem[] = accounts.map(item=>({
        ...item,
        key:item.email,
    }))

    return (
        accounts.length ?
            <StyledTable
                className="test"
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.notes}</p>,
                    rowExpandable: (record) => !!record.notes,
                }}
                dataSource={data}
            /> : <input type="file" onChange={handleFile}/>
    )
}

const StyledTable = styled(Table)`
    .ant-table-pagination-right {
        justify-content: center !important
    }

`;