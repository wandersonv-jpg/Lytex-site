import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Check, ImagePlus, Loader2, LockKeyhole, Save, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedType = (typeof allowedTypes)[number];
type EditableItem = {
  id: number;
  slug: string;
  category: string;
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isVisible: number;
};

export default function Admin() {
  return (
    <DashboardLayout>
      <AdminContent />
    </DashboardLayout>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [items, setItems] = useState<EditableItem[]>([]);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const adminQuery = trpc.portfolio.listAdmin.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const updateItem = trpc.portfolio.update.useMutation();
  const uploadImage = trpc.portfolio.uploadImage.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (adminQuery.data) {
      setItems(adminQuery.data.map((item) => ({
        id: item.id,
        slug: item.slug,
        category: item.category,
        tag: item.tag,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder,
        isVisible: item.isVisible,
      })));
    }
  }, [adminQuery.data]);

  if (user?.role !== "admin") {
    return (
      <div className="admin-empty-state">
        <LockKeyhole size={30} />
        <span className="admin-kicker">Área protegida</span>
        <h1>Somente administradores</h1>
        <p>Entre com a conta administradora do projeto para editar o catálogo da Lytex.</p>
      </div>
    );
  }

  const changeItem = (id: number, patch: Partial<EditableItem>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const saveItem = async (item: EditableItem) => {
    setSavingId(item.id);
    try {
      await updateItem.mutateAsync({
        id: item.id,
        category: item.category,
        tag: item.tag,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder,
        isVisible: item.isVisible,
      });
      await Promise.all([utils.portfolio.list.invalidate(), utils.portfolio.listAdmin.invalidate()]);
      toast.success("Item atualizado e publicado no catálogo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o item.");
    } finally {
      setSavingId(null);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, item: EditableItem) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!allowedTypes.includes(file.type as AllowedType)) {
      toast.error("Escolha uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 10 MB.");
      return;
    }

    setUploadingId(item.id);
    try {
      const dataBase64 = await readAsDataUrl(file);
      const stored = await uploadImage.mutateAsync({
        fileName: file.name,
        contentType: file.type as AllowedType,
        dataBase64,
      });
      const nextItem = { ...item, imageUrl: stored.url };
      changeItem(item.id, { imageUrl: stored.url });
      await updateItem.mutateAsync({ id: item.id, imageUrl: stored.url });
      await Promise.all([utils.portfolio.list.invalidate(), utils.portfolio.listAdmin.invalidate()]);
      toast.success("Foto atualizada e publicada.");
      void nextItem;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a foto.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <span className="admin-kicker">Lytex / Conteúdo</span>
          <h1>Editor do portfólio</h1>
          <p>Atualize fotos e textos. As mudanças aparecem na vitrine pública após salvar.</p>
        </div>
        <div className="admin-user-chip"><span className="admin-user-dot" />{user.name || user.email || "Administrador"}</div>
      </div>

      <div className="admin-notice"><Check size={16} /><span>Você está editando o catálogo publicado da Lytex.</span><span className="admin-notice-count">{items.length} itens</span></div>

      {adminQuery.isLoading ? (
        <div className="admin-loading"><Loader2 className="admin-spinner" size={23} /> Carregando itens editáveis…</div>
      ) : adminQuery.isError ? (
        <div className="admin-error">Não foi possível carregar o catálogo. Atualize a página e tente novamente.</div>
      ) : (
        <div className="admin-items">
          {items.map((item) => (
            <article className="admin-item-card" key={item.id}>
              <div className="admin-item-preview">
                <img src={item.imageUrl} alt="" />
                <label className="admin-upload-label">
                  {uploadingId === item.id ? <Loader2 className="admin-spinner" size={18} /> : <ImagePlus size={18} />}
                  <span>{uploadingId === item.id ? "Enviando…" : "Trocar foto"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploadingId === item.id} onChange={(event) => void handleImageChange(event, item)} />
                </label>
              </div>
              <div className="admin-item-fields">
                <div className="admin-item-heading"><span>{item.slug}</span><span className={item.isVisible ? "admin-visible" : "admin-hidden"}>{item.isVisible ? "Visível" : "Oculto"}</span></div>
                <label><span>Categoria</span><input value={item.category} onChange={(event) => changeItem(item.id, { category: event.target.value })} /></label>
                <label><span>Etiqueta</span><input value={item.tag} onChange={(event) => changeItem(item.id, { tag: event.target.value })} /></label>
                <label><span>Título</span><input value={item.title} onChange={(event) => changeItem(item.id, { title: event.target.value })} /></label>
                <label><span>Legenda</span><textarea rows={3} value={item.description} onChange={(event) => changeItem(item.id, { description: event.target.value })} /></label>
                <div className="admin-item-footer">
                  <label className="admin-checkbox"><input type="checkbox" checked={Boolean(item.isVisible)} onChange={(event) => changeItem(item.id, { isVisible: event.target.checked ? 1 : 0 })} /><span>Mostrar no site</span></label>
                  <button className="admin-save-button" onClick={() => void saveItem(item)} disabled={savingId === item.id}>
                    {savingId === item.id ? <Loader2 className="admin-spinner" size={16} /> : <Save size={16} />}
                    {savingId === item.id ? "Salvando" : "Salvar"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}
