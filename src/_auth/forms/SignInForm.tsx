import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";

import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { SignInValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

const SignInForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const { mutateAsync: signInAccount, isPending: isSignInAccount} = useSignInAccount();

    const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        try {
            const user = {
                email: values.email, password: values.password
            }
    
            const session = await signInAccount(user);
                        
            if(session) {
                const isLoggedIn = await checkAuthUser();
                console.log(isLoggedIn);
                
                if(isLoggedIn) {
                    toast({ title: 'Log in successful' });
                    form.reset();
                    navigate('/');
                }
            }

        } catch (error) {
            return toast({ title: 'Sign up failed. Please try again' })
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/public/assets/images/logo.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Log in to your account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                   Welcome back! Please enter your details
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type='email' placeholder="enter your email" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type='password' placeholder="enter your password" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isSignInAccount ? (
                            <div className="flex-center gap-2">
                                <Loader />  Loading...
                            </div> 
                        ): 'Sign In'}
                    </Button>
                    
                    <p className="text-small-regular text-center mt-2 text-light-2">
                        Don't have an account?
                        <Link to='/sign-up' className="text-primary-500 font-semibold ml-1">Sign up</Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SignInForm;