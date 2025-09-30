import { useAuth } from '../contexts/use-auth';
import { Link } from "react-router-dom";
import iphone17 from '../shared/ui/imgs/17peomax.png'



const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-[linear-gradient(90.7deg,#211C24_0.64%,#211C24_101%)]  w-full">
      <div className="container ">


          {user?.role === 'ADMIN' &&<p className="font-monster font-500 text-[32px] text-main tracking-wide bg-gradient-to-r from-pink-600 to-black pl-10 border border-main">
             Admin panel
        </p>
        }

        <div className="py-[50px] flex-between relative">
          <div className="flex flex-col items-start gap-[24px]">
            <span className='text-[25px] text-[#909090]  font-semibold leading-[32px] '>Pro.Beyond.</span>
            <h1 className='text-[96px] text-main leading-[72px] font-thin '>IPhone 17 <span className='font-semibold'>Pro </span></h1>
            <p className='font-medium  leading-[24px] text-[18px] text-[#909090] '>Created to change everything for the better. For everyone</p>
            <button className='hover:bg-main hover:text-primary hover:scale-110 font-medium  leading-[24px] text-[16px] py-[16px] px-[56px] bg-transparent border hover:border-primary border-main text-main rounded-[6px]' >
              <Link to="products"> Shop Now</Link>
            </button>
          </div>
          <div className="">
            <img src={iphone17} alt="iphone17"  />
          </div>
        </div>

     




  
      </div>
    </div>
  );
};

export default Home;
