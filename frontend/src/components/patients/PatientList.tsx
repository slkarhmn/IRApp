/* eslint-disable @typescript-eslint/no-explicit-any */
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import "../../styles/patientList.css"
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
// @ts-expect-error fuck typescript
import { patientService } from '../../services/patientService';

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
    {
        accessorKey: 'mrnNumber',
        header:'MRN',
    },
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
    {
        accessorKey:'createdAt',
        header:'Created At',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
        accessorKey: 'updatedAt',
        header:'Updated On',
        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
    }
];

export function PatientTable() {
    const [patients, setPatients] = useState<PatientDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await patientService.getAllPatients();
                
                // Transform Flask data to match table format
                const formattedPatients = response.data
                    .map((patient: any) => ({
                        id: patient.id,
                        fullName: `${patient.first_name} ${patient.last_name}`,
                        age: patient.age,
                        gender: patient.gender,
                        email: patient.email || 'N/A',
                        phoneNumber: patient.phone || 'N/A',
                        mrnNumber: patient.mrn,
                        hasInsurance: patient.insurance,
                        createdAt: patient.created_date,
                        updatedAt: patient.updated_date,
                    }))
                    
                
                setPatients(formattedPatients);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const table = useReactTable({
        data: patients,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading patients...</div>;
    }

    return (
        <div className="patient-table-container">
            <table className="patient-table">
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