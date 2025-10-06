/* eslint-disable @typescript-eslint/no-unused-vars */
// create a table for patient list using tanstack

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import "./patientDataList.json"
import "../../styles/patientList.css"
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
                <div className="font-medium">{row.original.fullName}</div>
                <div className="text-sm text-gray-500">
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
                <div>{row.original.email}</div>
                <div className="text-gray-500">{row.original.phoneNumber}</div>
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
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
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
        <div className="patient-table rounded-md border">
        <table className="w-full">
            <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                    <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                    >
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}