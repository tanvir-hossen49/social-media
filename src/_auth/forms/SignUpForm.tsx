import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { SignUpValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { checkAuthUser } = useUserContext()
    const { mutateAsync: createUserAccount, isPending: isCreatingUserAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount} = useSignInAccount();

    const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof SignUpValidation>) {
        try{
            const newUser = await createUserAccount(values);

            const user = {
                email: values.email, password: values.password
            }
   
            if(newUser) {
                const session = await signInAccount(user)

                if(session) {
                    const isLoggedIn = await checkAuthUser();

                    if(isLoggedIn) {
                        form.reset();
                        navigate('/')
                    }
                }
            }
        } catch(error) {
            return toast({title: 'Sign up failed. Please try again.'})
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/public/assets/images/logo.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Create a new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use Snapgram, please enter you details
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type='text' placeholder="enter your name" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                            <Input type='text' placeholder="enter your username" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
                        {isCreatingUserAccount ? (
                            <div className="flex-center gap-2">
                                <Loader />  Loading...
                            </div> 
                        ): 'Sign up'}
                    </Button>
                    
                    <p className="text-small-regular text-center mt-2 text-light-2">
                        Already have an account?
                        <Link to='/sign-in' className="text-primary-500 font-semibold ml-1">Log in</Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SignUpForm;