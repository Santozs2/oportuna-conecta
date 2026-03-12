import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Lock, User, Phone } from "lucide-react";
import logo from "../assets/logo.png";

interface AuthProps {
  onLogin: (user: { name: string; email: string; type: string; password: string }) => void;
  onRegister: (user: { name: string; email: string; type: string; password: string }) => void;
}

export function Auth({ onLogin, onRegister }: AuthProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "admin",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      onLogin({ name: "", email: loginData.email, password: loginData.password, type: "admin" });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password === registerData.confirmPassword) {
      onRegister({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        type: registerData.userType,
      });
    }
  };

const passwordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4 p-3">
            <img src={logo} alt="Oportuna" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white mb-2">Oportuna Conecta</h1>
          <p className="text-white/80">Qualificação e Oportunidades</p>
        </div>

        <Card className="p-6 shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>

                  {registerData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength(registerData.password) >= level
                                ? level <= 1 ? "bg-red-500"
                                  : level <= 2 ? "bg-orange-500"
                                    : level <= 3 ? "bg-yellow-500"
                                      : "bg-green-500"
                                : "bg-muted"
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength(registerData.password) <= 1 ? "text-red-500" :
                          passwordStrength(registerData.password) <= 2 ? "text-orange-500" :
                            passwordStrength(registerData.password) <= 3 ? "text-yellow-500" :
                              "text-green-500"
                        }`}>
                        {["", "Fraca", "Regular", "Boa", "Forte"][passwordStrength(registerData.password)]}
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        <li className={registerData.password.length >= 8 ? "text-green-500" : ""}>
                          {registerData.password.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
                        </li>
                        <li className={/[A-Z]/.test(registerData.password) ? "text-green-500" : ""}>
                          {/[A-Z]/.test(registerData.password) ? "✓" : "○"} Uma letra maiúscula
                        </li>
                        <li className={/[0-9]/.test(registerData.password) ? "text-green-500" : ""}>
                          {/[0-9]/.test(registerData.password) ? "✓" : "○"} Um número
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(registerData.password) ? "text-green-500" : ""}>
                          {/[^A-Za-z0-9]/.test(registerData.password) ? "✓" : "○"} Um caractere especial (!@#$...)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full mt-6">
                  Entrar
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Não tem uma conta? Use a aba Cadastrar
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-phone">Telefone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm">Confirmar Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {registerData.password !== registerData.confirmPassword && registerData.confirmPassword && (
                  <p className="text-sm text-destructive">As senhas não coincidem</p>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={registerData.password !== registerData.confirmPassword || passwordStrength(registerData.password) < 3}
                >
                  Criar Conta
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Já tem uma conta? Use a aba Entrar
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          © 2026 Oportuna. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}