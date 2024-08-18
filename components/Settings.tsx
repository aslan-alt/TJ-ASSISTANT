import {ExcelRenderer} from 'react-excel-renderer';
import {Button, Table, type TableColumnsType} from "antd";
import {StoreNames, useDeleteAllAccounts, useGetAccounts, useUpdateAccounts} from "~utils/indexedDB";
import styled from "styled-components";
import {DeleteOutlined} from "@ant-design/icons";
import type {AccountItem} from "~constants";
import {isEmpty} from "lodash";


export const Settings = ()=> {
    const {data:accounts,...rest} =useGetAccounts()
    const {mutateAsync:updateAccounts} = useUpdateAccounts(StoreNames.All)
    const {mutateAsync:updateLoginAccounts} = useUpdateAccounts(StoreNames.Login)
    const {mutateAsync:updateImpersonateAccounts} = useUpdateAccounts(StoreNames.Impersonate)
    const {mutateAsync:deleteAllAccounts} = useDeleteAllAccounts()

    const handleFile = (event) => {
        const fileObj = event.target.files[0];

        ExcelRenderer(fileObj, async(err, resp) => {
            if (err) {
                console.log(err);
            } else {

                const accountsFromExcel:AccountItem[] = resp.rows.slice(1).filter((row) => {
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
                    createdAt: new Date().toISOString(),
                }))
                try {

                    await updateAccounts(accountsFromExcel);
                    await updateLoginAccounts(accountsFromExcel?.filter(account=>!isEmpty(account?.password)))
                    await updateImpersonateAccounts(accountsFromExcel?.filter(account=>!isEmpty(account?.userId)))
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };


    const columns: TableColumnsType<Partial<AccountItem>> = [
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