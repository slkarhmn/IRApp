// components/patients/PatientCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User } from 'lucide-react';

function PatientCard({ patient, onClick, className }) {
  const hasAllergies = patient.allergies && patient.allergies.length > 0;
  const hasAlerts = patient.activeAlerts > 0;

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={() => onClick(patient)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{patient.full_name}</CardTitle>
          {hasAlerts && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {patient.activeAlerts}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">MRN: {patient.mrn}</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {patient.age}y, {patient.gender}
          </div>
          <div>Insurance: {patient.insurance}</div>
        </div>

        {hasAllergies && (
          <div className="mt-2 p-2 bg-red-50 rounded-md">
            <p className="text-xs text-red-700 font-medium">
              ⚠ Allergies: {patient.allergies.slice(0, 2).join(', ')}{' '}
              {patient.allergies.length > 2 && `+${patient.allergies.length - 2} more`}
            </p>
          </div>
        )}

        {patient.nextProcedure && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              Next: {patient.nextProcedure.name} - {formatDate(patient.nextProcedure.date)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PatientCard;
