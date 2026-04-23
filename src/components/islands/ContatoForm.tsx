import { useState, useEffect } from "react";
import {
  INTERESSE_OPTIONS,
  EMAIL_REGEX,
  type Interesse,
} from "@/types/contato";

type FormState = "idle" | "loading" | "success" | "error";

interface ContatoFormData {
  nome: string;
  email: string;
  interesse: Interesse | "";
  mensagem: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  interesse?: string;
  mensagem?: string;
}

const WHATSAPP_NUMBER = "5521973101451";

function validate(data: ContatoFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nome || data.nome.trim().length < 2)
    errors.nome = "Nome deve ter pelo menos 2 caracteres.";
  if (!data.email || !EMAIL_REGEX.test(data.email))
    errors.email = "Email inválido.";
  if (!data.interesse) errors.interesse = "Selecione uma opção.";
  if (!data.mensagem || data.mensagem.trim().length < 10)
    errors.mensagem = "Mensagem deve ter pelo menos 10 caracteres.";
  return errors;
}

export default function ContatoForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<ContatoFormData>({
    nome: "",
    email: "",
    interesse: "",
    mensagem: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("contato:hydrated"));
  }, []);

  const showWhatsApp =
    formData.interesse === "Gravação de Podcast" ||
    formData.interesse === "Produção de Áudio";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá! Gostaria de saber mais sobre ${formData.interesse} no Estúdio Entre.`,
  )}`;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormState("loading");

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormState("success");
        setFormData({ nome: "", email: "", interesse: "", mensagem: "" });
        setErrors({});
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <output className="contato__success">
        <p className="contato__success-text">
          Mensagem enviada! Entraremos em contato em breve.
        </p>
        <button
          type="button"
          className="contato__submit"
          onClick={() => setFormState("idle")}
        >
          Enviar outra mensagem
        </button>
      </output>
    );
  }

  return (
    <>
      <form className="contato__form" onSubmit={handleSubmit} noValidate>
        <div className="contato__field">
          <label htmlFor="contato-nome" className="contato__label">
            Nome
          </label>
          <input
            id="contato-nome"
            name="nome"
            type="text"
            className="contato__input"
            value={formData.nome}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.nome}
          />
          {errors.nome && (
            <span className="contato__error" role="alert">
              {errors.nome}
            </span>
          )}
        </div>

        <div className="contato__field">
          <label htmlFor="contato-email" className="contato__label">
            Email
          </label>
          <input
            id="contato-email"
            name="email"
            type="email"
            className="contato__input"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span className="contato__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="contato__field">
          <label htmlFor="contato-interesse" className="contato__label">
            Interesse
          </label>
          <div className="contato__select-wrapper">
            <select
              id="contato-interesse"
              name="interesse"
              className="contato__select"
              value={formData.interesse}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.interesse}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {INTERESSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {errors.interesse && (
            <span className="contato__error" role="alert">
              {errors.interesse}
            </span>
          )}
        </div>

        <div className="contato__field">
          <label htmlFor="contato-mensagem" className="contato__label">
            Mensagem
          </label>
          <textarea
            id="contato-mensagem"
            name="mensagem"
            className="contato__textarea"
            rows={4}
            value={formData.mensagem}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.mensagem}
          />
          {errors.mensagem && (
            <span className="contato__error" role="alert">
              {errors.mensagem}
            </span>
          )}
        </div>

        <output className="contato__feedback">
          {formState === "error" && (
            <p className="contato__feedback--error">
              Erro ao enviar. Tente novamente.
            </p>
          )}
        </output>

        <button
          type="submit"
          className="contato__submit"
          disabled={formState === "loading"}
        >
          {formState === "loading" ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>

      {showWhatsApp && (
        <a
          className="contato__whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale pelo WhatsApp"
          data-cursor="WHATSAPP"
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="white"
            role="img"
            aria-label="WhatsApp"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      )}
    </>
  );
}
