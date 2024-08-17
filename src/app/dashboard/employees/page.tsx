"use client";

import { Button } from '@/components/atoms/Button';
import { useToast } from "@/lib/hooks/useToast";

interface IAppProps {
    test: string;
}

const EmployeesPage: React.FC<IAppProps> = (props) => {
    const {toast} = useToast();
    return (
       <>
        <Button
          aria-label="Increment value"
          onClick={() => {
            toast({
              title: "this is sample toast",
              description: "Friday, February 10, 2023 at 5:57 PM",
            });
          }}
        >
          +
        </Button>
        <div>This is employee page</div>
       </>
    )
};

export default EmployeesPage;