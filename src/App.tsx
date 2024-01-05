import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import AuthLayout from './_auth/AuthLayout';

import { Home } from './_root/pages';
import RootLayout from './_root/RootLayout';
import AllUsers from './_root/pages/AllUsers';
import Saved from './_root/pages/Saved';
import CreatePost from './_root/pages/CreatePost';
import Explore from './_root/pages/Explore';
import EditPost from './_root/pages/EditPost';
import UpdateProfile from './_root/pages/UpdateProfile';
import Profile from './_root/pages/Profile';
import PostDetails from './_root/pages/PostDetails';

const App = () => {
    return (
        <main className='flex h-screen'>
            <Routes>
                {/* public route */}
                <Route element={<AuthLayout />}>
                    <Route path='/sign-in' element={<SignInForm />}/>
                    <Route path='/sign-up' element={<SignUpForm />}/>
                </Route>

                {/* private route */}
                <Route element={ <RootLayout /> }>
                    <Route index element={ <Home /> } />
                    <Route path='/explore' element={ <Explore />} />
                    <Route path='/saved' element={ <Saved />} />
                    <Route path='/all-users' element={ <AllUsers />} />
                    <Route path='/create-post' element={ <CreatePost />} />
                    <Route path='/update-post/:id' element={ <EditPost />} />
                    <Route path='/post/:id' element={ <PostDetails />} />
                    <Route path='/profile/:id' element={ <Profile />} />
                    <Route path='/update-profile/:id' element={ <UpdateProfile />} />
                </Route>
            </Routes>
            
        <Toaster />
        </main>
    );
};

export default App;