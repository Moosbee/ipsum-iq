import React from "react";

function Login(props: any) {
  return (
    <div className=" bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="grid place-items-center h-screen">
        <div className="Login w-80 h-80 shadow rounded bg-white">
          <img className="scale-75 pb-8" src="logotest.png" alt="" />

          <form method="POST">
            <div className="pt-2 flex justify-center">
              <label className="border-b border-black">
                <input
                  className="ttit ppearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  name="Username"
                  placeholder="Username"
                  required
                />
              </label>
            </div>
            <div className="pt-6 flex justify-center">
              <label className="border-b border-black">
                <input
                  className="ttit ppearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="password"
                  name="Passwort"
                  placeholder="Passwort"
                  required
                />
              </label>
            </div>
            <div className=" flex justify-center pt-7">
            {/* dark:bg-gray-900 bei span */}
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Absenden
              </span>
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { Login };
