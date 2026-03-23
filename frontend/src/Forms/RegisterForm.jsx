import { useState } from "react";


const RegisterForm = ({onSuccess}) => {

        const [formData, setFormData] = useState({
        firstName:'',
        middleName:'',
        lastName:'',
        email:'',
        password:'',
        mobileNo:'',
        isShop:'false',
        shopName:'',
        panNUmber:''
        })

        const handleRegister = () => {  };



return (
    <form onSubmit={handleRegister}>
        <div className="grid grid-cols-3 gap-3">
            <div>
                <label className="label-editorial">First Name</label>
                <input
                type="text"
                className="input-editorial"
                placeholder="John"
                onChange={(e) => {setFormData({...formData, firstName: e.target.value}) }}
                required
                />
            </div>
            <div>
                <label className="label-editorial">Middle Name</label>
                <input
                type="text"
                className="input-editorial"
                placeholder="Middle"
                onChange={(e) => {setFormData({...formData, middleName: e.target.value}) }}
                required
                />
            </div>
            <div>
                <label className="label-editorial">Last Name</label>
                <input
                type="text"
                className="input-editorial"
                placeholder="Doe"
                onChange={(e) => {setFormData({...formData, lastName: e.target.value}) }}
                required
                />
            </div>
        </div>



    </form>
)
};

export default RegisterForm;