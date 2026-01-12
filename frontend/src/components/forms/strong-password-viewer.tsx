import { Check, X } from "lucide-react";

interface PasswordRequirement {
  check: (password: string) => boolean;
  text: string;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    check: (password) => password.length >= 8,
    text: "Contiene al menos 8 caracteres",
  },
  {
    check: (password) => /[0-9]/.test(password),
    text: "Contiene al menos 1 número",
  },
  {
    check: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    text: "Contiene al menos 1 carácter especial",
  },
  {
    check: (password) => /[A-Z]/.test(password),
    text: "Contiene al menos 1 letra mayúscula",
  },
  {
    check: (password) => /[a-z]/.test(password),
    text: "Contiene al menos 1 letra minúscula",
  },
];

interface Props {
  value: string;
}

const getStrengthLabel = (strength: number) => {
  if (strength <= 2) return "Débil";
  if (strength <= 4) return "Moderada";
  return "Fuerte";
};
const getStrengthColor = (strength: number) => {
  if (strength <= 2) return "bg-red-500";
  if (strength <= 4) return "bg-yellow-500";
  return "bg-green-500";
};

const StrongPasswordViewer = (props: Props) => {
  const { value } = props;
  const requirements = passwordRequirements.map((req) => req.check(value));
  const strength = requirements.filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full ${getStrengthColor(strength)}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Fuerza de la contraseña:{" "}
          <span className="font-medium">{getStrengthLabel(strength)}</span>
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Requisitos de la contraseña:</p>
        <ul className="space-y-1">
          {passwordRequirements.map((req, index) => (
            <li key={index} className="flex items-center space-x-2">
              {requirements[index] ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  requirements[index] ? "text-green-700" : "text-red-700"
                }`}
              >
                {req.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StrongPasswordViewer;
