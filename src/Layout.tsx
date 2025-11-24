import { motion } from 'framer-motion';
import React, { Suspense } from 'react';
import PageContainer from './layout/PageContainer';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores';
import { useCheckSession } from '@hooks/useCheckSession';
import CustomPageLoader from '@common/CustomLoader';

export default observer(function ({ children }: React.PropsWithChildren<any>) {
    const { authStore } = useStore();
    const { auth, setCurrentSessionUser } = authStore;
    useCheckSession(setCurrentSessionUser, auth?.getUser())
    return (
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="dark:bg-[#0e1517] min-h-screen flex flex-col justify-between overflow-hidden mb-0 pb-0"
            >

                <div className="mx-auto min-h-screen overflow-hidden lg:w-6xl mb-[15rem]">
                    <main className="grid grid-cols-9">
                        <Suspense
                            fallback={
                                <CustomPageLoader title='Loading' />
                            }
                        >
                            <PageContainer>{children}</PageContainer>
                        </Suspense>
                    </main>
                </div>
                <footer className={`
                    relative left-0 z-[900] bg-white dark:bg-[#1d2a2e] text-gray-900 dark:text-gray-300 w-full mt-6 
                `}>
                    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div id="footer-img" className="flex justify-start">
                                <img
                                    className={`
                                        m-0 h-full w-full md:w-[90%] transition-all duration-200 
                                        sidebarLogo
                                        cursor-pointer
                                    `}
                                    alt=""
                                    style={{ maxWidth: "unset" }}
                                />
                            </div>

                            <div className="flex gap-6 text-sm">
                                <a href="/privacy-policy" className="dark:hover:text-white hover:opacity-70 text-[#55a8c2]">
                                    Privacy
                                </a>
                                <a href="/terms-and-conditions" className="dark:hover:text-white hover:opacity-70 text-[#55a8c2]">
                                    Terms
                                </a>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-sm text-gray-400">
                            © {new Date().getFullYear()} AlSaqr. All rights reserved.
                        </div>
                    </div>
                </footer>
            </motion.div>
    );
});