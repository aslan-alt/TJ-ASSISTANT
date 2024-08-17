import { ExcelRenderer } from 'react-excel-renderer';
import {Button, Table, type TableColumnsType} from "antd";
import {useDeleteAccount, useDeleteAllAccounts, useSaveAccounts} from "~utils/indexedDB";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {DeleteOutlined} from "@ant-design/icons";



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
    const {data:accounts,mutate} = useSaveAccounts()
    const {mutate:deleteAllAccounts} = useDeleteAllAccounts()

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
                    mutate(accountsFromExcel);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };


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

    const datax: AccountItem[] = accounts?.map(item=>({
        ...item,
        key:item.email,
    }))

    return (
        accounts?.length ?
           <div>
               <Button
                   type="primary"
                   shape="round" danger

                   icon={<DeleteOutlined />}
                   size="middle"
                   onClick={()=>{
                       deleteAllAccounts()
                   }}>
                   Clear accounts
               </Button>
               <StyledTable
                   className="test"
                   columns={columns}
                   expandable={{
                       expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.notes}</p>,
                       rowExpandable: (record) => !!record.notes,
                   }}
                   dataSource={datax}
               />
           </div> : <input type="file" onChange={handleFile}/>
    )
}

const StyledTable = styled(Table)`
    .ant-table-pagination-right {
        justify-content: center !important
    }

`;