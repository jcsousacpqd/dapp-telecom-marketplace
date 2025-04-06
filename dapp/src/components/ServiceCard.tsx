import { ethers } from 'ethers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  svc: any;
  onHire: (id: string) => void;
}

export function ServiceCard({ svc, onHire }: Props) {
  return (
    <Card className="shadow-md rounded-2xl border border-gray-200">
      <CardContent className="p-4 space-y-2">
        <h2 className="text-lg font-medium">{svc.description}</h2>
        <p className="text-sm text-gray-500">Fornecedor: {svc.supplier}</p>
        <p className="text-sm">Preço total: {ethers.utils.formatUnits(svc.totalPrice, 18)} TLC</p>
        <Button onClick={() => onHire(svc.id)} className="bg-green-600 hover:bg-green-700">
          Contratar
        </Button>
      </CardContent>
    </Card>
  );
}
