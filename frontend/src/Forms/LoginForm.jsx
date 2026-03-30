import useShop from "@/hooks/useShop.js";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LoginForm = ({onSuccess}) => {

    const { login } = useShop();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '', password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, formData);
            
            console.log("postman confirmed this data:", data);
            if (data._id) {

               await login(data); // Update context with token and user info

                // trigger the success signal
                if(onSuccess) onSuccess();

                // toasting for success
                toast.success(`welcome Back, ${data.name}`)

            }
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid secret key or email')
        } finally {
            setLoading(false);
        }
    };
    return (
        <form
            onSubmit={handleSubmit} className="" >
                {error && (
                    <p className="text-editorial-red text-[12px] bg-editorial-red/5 p-3 rounded-lg border border-editorial-red/10 italic">{error}</p>
                )}
            <div className="space-y-4">
                <div>
                    <label className="label-editorial">Email</label>
                    <div>
                        <input type="email"
                            placeholder="example@gmail.com"
                            className="input-editorial"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required />
                    </div>
                </div>

                <div>
                    <label className="label-editorial">Password</label>
                    <input type="password"
                        name="password"
                        placeholder="*********"
                        autoComplete="current-password"
                        className="input-editorial"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required />
                </div>
            </div>


            <button
                type="submit"
                disabled={loading}
                className=" btn-editorial mt-3 mx-auto w-full ">
                {loading?(
                <>
                <Loader2 size={18} className="animate-spin"/>
                Authenticating...
                </>):('Enter Library')}
            </button>

            <p className="text-center mt-2">Forgot your password</p>
        </form>

    )
};

export default LoginForm;