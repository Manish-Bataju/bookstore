import useShop from "@/hooks/useShop.js";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";


const RegisterForm = ({ onSuccess }) => {

    const { backendUrl, setIsProfileDrawerOpen } = useShop();

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNo: '',
        isShop: 'false',
        shopName: '',
        panNumber: ''
    })

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("DEBUG 2: Default preventDefault() called.");
        setIsLoading(true);
        setError("");

        try {
            console.log(`DEBUG 4: Attempting Axios POST to: ${backendUrl}/api/user/register`);
            // connect the registration route to the backend using axios
            const response = await axios.post(`${backendUrl}/api/user/register`, formData)
            console.log("DEBUG 5: Axios Success! Response:", response);

            if (response.status === 201) {
                console.log("Success! UserSaved:", response.data);
                setIsProfileDrawerOpen(false);

                // trigger the success signal
                if (onSuccess) onSuccess();

                // toasting for success
                toast.success("Registration Successful ! Please Login")
            }
        } catch (err) {
            const serverMessage = err.response?.data?.message || "Something is Wrong";
            setError(serverMessage);
            console.error("Registration Error:", err);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-3 items-center">
                    <div className="flex flex-col justify-center items-start">
                        <label className="label-editorial">First Name</label>
                        <input
                            type="text"
                            className="input-editorial"
                            placeholder="John"
                            onChange={(e) => { setFormData({ ...formData, firstName: e.target.value }) }}
                            required
                        />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                        <label className="label-editorial">Mid. Name</label>
                        <input
                            type="text"
                            className="input-editorial"
                            placeholder="Middle"
                            onChange={(e) => { setFormData({ ...formData, middleName: e.target.value }) }}
                            required
                        />
                    </div>
                    <div className="flex flex-col justify-center items-start mt-1">
                        <label className="label-editorial">Last Name</label>
                        <input type="text"
                            className="input-editorial"
                            placeholder="Doe"
                            onChange={(e) => { setFormData({ ...formData, lastName: e.target.value }) }}
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="label-editorial">email</label>
                    <input type="email"
                        className="input-editorial"
                        placeholder="customer@example.com"
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
                        required />
                </div>

                {/* Password */}
                <div>
                    <label className="label-editorial">password</label>
                    <input type="password"
                        className="input-editorial"
                        placeholder="************"
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
                        required />
                </div>


                {/* Mobile No */}
                <div>
                    <label className="label-editorial">Mobile No</label>
                    <input type="tel"
                        className="input-editorial"
                        onChange={(e) => { setFormData({ ...formData, mobileNo: e.target.value }) }}
                        required />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    onClick={handleRegister}
                    className="btn-primary w-full">
                    {isLoading ? 'Saving..' : 'Register'}
                </button>
            </div>

        </form>
    )
};

export default RegisterForm;