"use client";
import authStore from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string()
    .min(4, "Mot de passe trop court")
    .required("Mot de passe requis"),
});

type FormValues = Yup.InferType<typeof schema>;

export default function Login() {
  const { login, auth, getMe, loading } = authStore();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await login(data);
      await getMe();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  useEffect(() => {
    if (auth) {
      router.push("/");
    }
  }, [auth]);

  return (
    <Stack
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div className="flex items-center flex-col gap-2 shadow-lg rounded-lg p-10">
        <Typography variant="h4" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ width: 300, marginBottom: 2 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  fullWidth
                  variant="outlined"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  fullWidth
                  variant="outlined"
                  label="Mot de passe"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Se connecter
            </Button>
          </Stack>
        </form>
      </div>
    </Stack>
  );
}
