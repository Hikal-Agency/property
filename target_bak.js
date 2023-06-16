  <TabPanel value={tabValue} index={0}>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12">
            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                MANAGER
              </div>
              <div>
                {Manager?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* AGENT  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                AGENT
              </div>
              <div>
                {Agent.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabPanel>






        <!-- last month -->

        <TabPanel value={tabValue} index={1}>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12">
            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                MANAGER
              </div>
              <div>
                {Manager.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* AGENT  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                AGENT
              </div>
              <div>
                {Agent.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabPanel>