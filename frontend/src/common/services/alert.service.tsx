import { toast } from "react-hot-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertProps {
  message?: string;
  title?: string;
}
type VariantType = "default" | "destructive";

class AlertService {
  show(variant: VariantType, title?: string, message?: string) {
    toast.custom(() => (
      <Alert variant={variant} className="max-w-[500px]">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    ));
  }

  success(props: AlertProps) {
    this.show("default", props.title, props.message);
  }

  error(props: AlertProps) {
    this.show("destructive", props.title, props.message);
  }

  // warning(message: string) {
  // 	this.show('warning', props.title, props.message);
  // }

  // info(message: string) {
  // 	this.show(message, 'info');
  // }
}

export const alertService = new AlertService();
