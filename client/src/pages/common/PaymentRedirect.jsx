import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/my-enrollments", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium">
        Finalizing your enrollment...
      </p>
    </div>
  );
};

export default PaymentRedirect;
