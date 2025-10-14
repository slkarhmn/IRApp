/* eslint-disable @typescript-eslint/no-unused-vars */
// create a table for patient list using tanstack

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import "./patientDataList.json"
import "../../styles/patientList.css"
import React from "react";
import { Link } from "react-router-dom";
// define the fields
// type PatientDetail = {

//     id:{
//         idNumber: number
//     }
//     patientDetail:{
//         fullName: string
//         age: number
//         gender: string
//     }
//     contactInformation:{
//         email: string
//         phoneNumber: number
//     }
//     mrn:{
//         mrnNumber: string 
//     }
//     insurance:{
//         hasInsurance: boolean
//     }
//     createdAt:{
//         dateCreated: string
//     }
//     updatedAt:{
//         dateUpdated: string
//     }
// }

export type PatientDetail = {
  id: number;
  fullName: string;
  age: number;
  gender: string;
  email: string;
  phoneNumber: string; 
  mrnNumber: string;
  hasInsurance: boolean;
  createdAt: string;
  updatedAt: string;
}



const columns: ColumnDef<PatientDetail>[] = [
    
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'fullName',
        header: 'Patient Details',
        cell: ({row}) =>(
            <div>
                <div className="font-medium">
                    <Link
                        to={`/patients/${row.original.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"

                    >
                        {row.original.fullName}
                    </Link>
                </div>
                <div className="agengender-style">
                {row.original.age} yrs, {row.original.gender}
                </div>
            </div>
        ),
    },
    //contact info
    {
        accessorKey: 'email',
        header: 'Contact Information',
        cell: ({ row }) => (
            <div className="text-sm">
                <div className="email-style">{row.original.email}</div>
                <div className="phonenum-style">{row.original.phoneNumber}</div>
            </div>
        ),
    },
    // mrn
    {
        accessorKey: 'mrnNumber',
        header:'MRN',
    },
    //insurance
    {
        accessorKey:'hasInsurance',
        header:'Insurance',
        cell: ({ row }) => (
        <button
            className={`px-4 py-1 rounded ${
            row.original.hasInsurance
                ? "yes-button"
                : "no-button"
            }`}
        >
            {row.original.hasInsurance ? "Yes" : "No"}
        </button>
        ),
    },
    //created at
    {
        accessorKey:'createdAt',
        header:'Created At',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    //updated at
    {
        accessorKey: 'updatedAt',
        header:'Updated On',
        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
    }
];

interface PatientTableProps  {
    data: PatientDetail[]
}
export function PatientTable ({data}: PatientTableProps){
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="patient-table-container">
            <table className="patient-table">
                {/* TABLE HEAD - Render column headers */}
                <thead className="table-header">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="header-row">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="header-cell">
                                    <div className="header-content">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                {/* TABLE BODY - Render data rows */}
                <tbody className="table-body">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="body-row">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="body-cell">
                                    <div className="cell-content">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}