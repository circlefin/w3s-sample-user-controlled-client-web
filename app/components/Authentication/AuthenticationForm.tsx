"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useW3sContext } from "../Providers/W3sProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@mui/joy/Button";
import { signIn, useSession } from "next-auth/react";
import { TextField } from "@/app/components/TextField";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { IconButton, Typography } from "@mui/joy";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Content } from "..";

const formSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Email required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password required"),
});

type FormInputs = yup.InferType<typeof formSchema>;

interface AuthenticationFormProps {
  /**
   * Is the form a sign in form
   */
  isSignIn?: boolean;
}

export const AuthenticationForm: React.FC<AuthenticationFormProps> = ({
  isSignIn = true,
}) => {
  const { register, handleSubmit, formState } = useForm<FormInputs>({
    resolver: yupResolver(formSchema),
  });
  const [loading, setLoading] = useState(false);
  const [isMasked, setIsMasked] = useState(true);
  const [formMessage, setFormMessage] = useState<string | undefined>(undefined);
  const [redirect, setRedirect] = useState<boolean>(false);
  const router = useRouter();
  const { client } = useW3sContext();
  const { data: session } = useSession();

  useEffect(() => {
    if (redirect && client && session) {
      if (session.user.challengeId) {
        client.execute(session.user.challengeId, (error, result) => {
          if (error) {
            setFormMessage("An error occurred on PIN Setup. Please try again.");
          } else if (result) {
            // result will be undefined if popup is closed
            // only navigate to wallets if PIN setup complete
            router.push("/wallets");
          }
        });
      } else {
        router.push("/wallets");
      }
      setLoading(false);
    }
  }, [redirect, session, session?.user, client, router]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    if (!isSignIn) {
      const res = await signIn("SignUp", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        return setRedirect(true);
      } else if (res?.error) {
        setFormMessage(res.error);
      } else {
        setFormMessage("An error occurred on Sign Up. Please try again.");
      }
      setLoading(false);
    } else {
      const res = await signIn("SignIn", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        return setRedirect(true);
      } else {
        setFormMessage("Invalid Credentials.");
      }
      setLoading(false);
    }
  };
  return (
    <Content>
      <h1 className="text-center font-bold text-3xl pt-8">
        {isSignIn ? "Sign In" : "Sign Up"}
      </h1>

      {!isSignIn && (
        <Typography className="text-center text-sm font-medium">{`Don't have an account?`}</Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col grow">
        <div className="grow space-y-4 mb-4">
          <TextField
            placeholder="Email"
            type="email"
            className="flex"
            error={!!formState.errors.email?.message}
            helperText={formState.errors.email?.message}
            {...register("email")}
          />
          <TextField
            placeholder="Password"
            type={isMasked ? "password" : "text"}
            className="flex"
            error={!!formState.errors.password?.message}
            helperText={formState.errors.password?.message}
            endDecorator={
              <IconButton onClick={() => setIsMasked((f) => !f)}>
                {isMasked ? <EyeSlashIcon /> : <EyeIcon />}
              </IconButton>
            }
            {...register("password")}
          />
          <Button
            variant="solid"
            className="w-full"
            size="lg"
            type="submit"
            loading={loading}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
          <p className="text-yellow-500">{formMessage ? formMessage : ""}</p>
        </div>
      </form>

      <Typography className="text-center text-sm font-medium">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
      </Typography>

      <Button
        variant="plain"
        className="w-full"
        onClick={
          isSignIn ? () => router.push("/signup") : () => router.push("/signin")
        }
      >
        {!isSignIn ? "Sign In" : "Sign Up"}
      </Button>
    </Content>
  );
};
