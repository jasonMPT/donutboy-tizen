
export default function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen gap-4 bg-pink-400'>
        <h2 className='text-4xl font-bold text-slate-100'>Sweet fluffy delicious donuts right to your door in 10 mins. </h2>
        <h3 className='text-2xl font-bold text-slate-100'>Find a family owned donut shop near you. </h3>
        <form className='pl-8 bg-white rounded-full w-fit' action="">
            <input className='p-4 focus:outline-none w-96' type="text" name="zip" placeholder='Enter Address, City, abd State or Zip Code'/>
            <button className='px-8 py-4 bg-red-200 rounded-full'>Search</button>
        </form>
    </div>
  )
}
