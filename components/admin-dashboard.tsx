"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  FileText,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Globe,
  Palette,
  Link as LinkIcon,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react"
import type { Article, SiteSettings, SocialProofItem } from "@/lib/data"

type Tab = "settings" | "posts" | "social-proof"

// ---- Toast Notification ----
function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: "success" | "error"
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 20, x: "-50%" }}
      className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
        type === "success"
          ? "border border-primary/30 bg-primary/10 text-primary"
          : "border border-destructive/30 bg-destructive/10 text-destructive"
      }`}
    >
      {type === "success" ? (
        <Check className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {message}
    </motion.div>
  )
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("posts")
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type })
    },
    []
  )

  const tabs = [
    {
      key: "settings" as Tab,
      label: "اعدادات الموقع",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      key: "posts" as Tab,
      label: "ادارة المقالات",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: "social-proof" as Tab,
      label: "اشعارات اجتماعية",
      icon: <Users className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border/50 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <span className="text-sm font-bold neon-text">V</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">
                لوحة التحكم
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Vorqenox Admin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin"
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            خروج
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "border border-primary/50 bg-primary/10 text-primary"
                  : "border border-transparent bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SiteSettingsPanel showToast={showToast} />
            </motion.div>
          )}
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PostManager showToast={showToast} />
            </motion.div>
          )}
          {activeTab === "social-proof" && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SocialProofEditor showToast={showToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Site Settings Panel ----
function SiteSettingsPanel({
  showToast,
}: {
  showToast: (msg: string, type?: "success" | "error") => void
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        setLoading(false)
      })
      .catch(() => {
        showToast("فشل في تحميل الاعدادات", "error")
        setLoading(false)
      })
  }, [showToast])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      showToast("تم حفظ الاعدادات بنجاح")
    } catch {
      showToast("فشل في حفظ الاعدادات", "error")
    }
    setSaving(false)
  }

  if (loading || !settings) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <SectionCard
        title="هوية الموقع"
        icon={<Globe className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              اسم الموقع
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              رابط الشعار
            </label>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={(e) =>
                setSettings({ ...settings, logoUrl: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="https://..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Color Picker */}
      <SectionCard
        title="لون النيون"
        icon={<Palette className="h-4 w-4" />}
      >
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={settings.neonColor}
            onChange={(e) =>
              setSettings({ ...settings, neonColor: e.target.value })
            }
            className="h-10 w-16 cursor-pointer rounded-lg border border-border bg-secondary"
          />
          <input
            type="text"
            value={settings.neonColor}
            onChange={(e) =>
              setSettings({ ...settings, neonColor: e.target.value })
            }
            className="w-32 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
            dir="ltr"
          />
          <div
            className="h-10 flex-1 rounded-lg"
            style={{
              backgroundColor: settings.neonColor,
              boxShadow: `0 0 20px ${settings.neonColor}`,
            }}
          />
        </div>
      </SectionCard>

      {/* Social Links */}
      <SectionCard
        title="روابط التواصل"
        icon={<LinkIcon className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {(["twitter", "telegram", "youtube", "instagram"] as const).map(
            (key) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs capitalize text-muted-foreground">
                  {key}
                </label>
                <input
                  type="text"
                  value={settings.socialLinks[key]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  dir="ltr"
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            )
          )}
        </div>
      </SectionCard>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "جاري الحفظ..." : "حفظ الاعدادات"}
      </button>
    </div>
  )
}

// ---- Post Manager ----
function PostManager({
  showToast,
}: {
  showToast: (msg: string, type?: "success" | "error") => void
}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [editing, setEditing] = useState<Article | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/articles")
      const data = await res.json()
      setArticles(data)
    } catch {
      showToast("فشل في تحميل المقالات", "error")
    }
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const handleSave = async (article: Article) => {
    try {
      if (isNew) {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(article),
        })
        if (!res.ok) throw new Error()
        showToast("تم اضافة المقال بنجاح")
      } else {
        const res = await fetch(`/api/articles/${article.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(article),
        })
        if (!res.ok) throw new Error()
        showToast("تم تحديث المقال بنجاح")
      }
      setEditing(null)
      setIsNew(false)
      loadArticles()
    } catch {
      showToast("فشل في حفظ المقال", "error")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      showToast("تم حذف المقال بنجاح")
      setConfirmDelete(null)
      loadArticles()
    } catch {
      showToast("فشل في حذف المقال", "error")
    }
  }

  const newArticle = (): Article => ({
    id: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "apps",
    imageUrl: "",
    isFeatured: false,
    specs: [
      { label: "Version", value: "" },
      { label: "Platform", value: "" },
      { label: "Size", value: "" },
      { label: "License", value: "" },
    ],
    downloadUrl: "",
    enableAds: true,
    enableTimer: true,
    enableViralLock: false,
    createdAt: "",
    updatedAt: "",
  })

  if (editing) {
    return (
      <ArticleEditor
        article={editing}
        onSave={handleSave}
        onCancel={() => {
          setEditing(null)
          setIsNew(false)
        }}
      />
    )
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">المقالات</h2>
          <p className="text-xs text-muted-foreground">
            {articles.length} {"مقال"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(newArticle())
            setIsNew(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          مقال جديد
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <FileText className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">لا توجد مقالات بعد</p>
          <button
            type="button"
            onClick={() => {
              setEditing(newArticle())
              setIsNew(true)
            }}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            اضف مقال جديد
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-sm font-bold text-primary">
                  {article.title.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-sm font-bold text-foreground"
                  dir="ltr"
                >
                  {article.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                    {article.category}
                  </span>
                  {article.isFeatured && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-500">
                      مميز
                    </span>
                  )}
                  {article.enableTimer && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                      مؤقت
                    </span>
                  )}
                  {article.enableAds && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
                      اعلانات
                    </span>
                  )}
                  {article.enableViralLock && (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                      قفل فيروسي
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(article)
                    setIsNew(false)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                  aria-label="تعديل المقال"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {confirmDelete === article.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      className="flex h-8 items-center gap-1 rounded-lg border border-destructive/50 bg-transparent px-2 text-[10px] font-medium text-destructive transition-all hover:bg-destructive/10"
                      aria-label="تأكيد الحذف"
                    >
                      <Check className="h-3 w-3" />
                      تأكيد
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground hover:text-foreground"
                      aria-label="الغاء"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(article.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive"
                    aria-label="حذف المقال"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Article Editor ----
function ArticleEditor({
  article,
  onSave,
  onCancel,
}: {
  article: Article
  onSave: (article: Article) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Article>(article)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof Article, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    if (!form.slug.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          {article.id ? "تعديل المقال" : "مقال جديد"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          الغاء
        </button>
      </div>

      <SectionCard
        title="المعلومات الاساسية"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              العنوان <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value)
                if (!article.id)
                  update("slug", generateSlug(e.target.value))
              }}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="Article title..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              الرابط المختصر <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="article-slug"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              الوصف
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="Short description..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              المحتوى
            </label>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              rows={8}
              className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="Full article content... Use - for bullet points"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                التصنيف
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="apps">Apps</option>
                  <option value="games">Games</option>
                  <option value="ai-tools">AI Tools</option>
                  <option value="gift-cards">Gift Cards</option>
                </select>
                <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                رابط التحميل
              </label>
              <input
                type="text"
                value={form.downloadUrl}
                onChange={(e) => update("downloadUrl", e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                dir="ltr"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              رابط الصورة
            </label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="https://..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Toggles */}
      <SectionCard
        title="خيارات المقال"
        icon={<Settings className="h-4 w-4" />}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ToggleSwitch
            label="مميز"
            description="اظهار في القسم البارز"
            checked={form.isFeatured}
            onChange={(v) => update("isFeatured", v)}
          />
          <ToggleSwitch
            label="اعلانات"
            description="عرض اماكن الاعلانات"
            checked={form.enableAds}
            onChange={(v) => update("enableAds", v)}
          />
          <ToggleSwitch
            label="مؤقت"
            description="تفعيل العد التنازلي"
            checked={form.enableTimer}
            onChange={(v) => update("enableTimer", v)}
          />
          <ToggleSwitch
            label="قفل فيروسي"
            description="مشاركة قبل التحميل"
            checked={form.enableViralLock}
            onChange={(v) => update("enableViralLock", v)}
          />
        </div>
      </SectionCard>

      {/* Specs */}
      <SectionCard
        title="المواصفات"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="space-y-3">
          {form.specs.map((spec, i) => (
            <div key={`spec-${i}`} className="flex gap-3">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => {
                  const newSpecs = [...form.specs]
                  newSpecs[i] = { ...newSpecs[i], label: e.target.value }
                  update("specs", newSpecs)
                }}
                className="w-1/3 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                dir="ltr"
                placeholder="Label"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const newSpecs = [...form.specs]
                  newSpecs[i] = { ...newSpecs[i], value: e.target.value }
                  update("specs", newSpecs)
                }}
                className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                dir="ltr"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => {
                  const newSpecs = form.specs.filter((_, idx) => idx !== i)
                  update("specs", newSpecs)
                }}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground hover:text-destructive"
                aria-label="حذف المواصفة"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update("specs", [...form.specs, { label: "", value: "" }])
            }
            className="text-xs text-primary hover:underline"
          >
            + اضافة مواصفة
          </button>
        </div>
      </SectionCard>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !form.title.trim() || !form.slug.trim()}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ المقال"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border bg-transparent px-6 py-3 text-sm text-muted-foreground transition-all hover:text-foreground"
        >
          الغاء
        </button>
      </div>
    </div>
  )
}

// ---- Social Proof Editor ----
function SocialProofEditor({
  showToast,
}: {
  showToast: (msg: string, type?: "success" | "error") => void
}) {
  const [items, setItems] = useState<SocialProofItem[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => {
        showToast("فشل في تحميل الاشعارات", "error")
        setLoading(false)
      })
  }, [showToast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/social-proof", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      if (!res.ok) throw new Error()
      showToast("تم حفظ الاشعارات بنجاح")
    } catch {
      showToast("فشل في حفظ الاشعارات", "error")
    }
    setSaving(false)
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        giftCardType: "",
        price: "",
        timeAgo: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            الاشعارات الاجتماعية
          </h2>
          <p className="text-xs text-muted-foreground">
            {items.length} {"اشعار - تظهر بشكل عشوائي للزوار"}
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          اشعار جديد
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <Users className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            لا توجد اشعارات بعد
          </p>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            اضف اشعار جديد
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {"اشعار رقم "}
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  حذف
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(i, "name", e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    dir="ltr"
                    placeholder="Ahmed K."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    نوع البطاقة
                  </label>
                  <input
                    type="text"
                    value={item.giftCardType}
                    onChange={(e) =>
                      updateItem(i, "giftCardType", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    dir="ltr"
                    placeholder="Amazon Gift Card"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    السعر
                  </label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    dir="ltr"
                    placeholder="$50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    الوقت
                  </label>
                  <input
                    type="text"
                    value={item.timeAgo}
                    onChange={(e) =>
                      updateItem(i, "timeAgo", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    dir="ltr"
                    placeholder="2 min ago"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "جاري الحفظ..." : "حفظ الاشعارات"}
      </button>
    </div>
  )
}

// ---- Helpers ----
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border/50 px-5 py-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex flex-col items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-right transition-all hover:border-primary/30"
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <div
          className={`relative h-5 w-9 rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-muted"
          }`}
        >
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
              checked
                ? "bg-primary-foreground right-0.5"
                : "bg-muted-foreground right-[calc(100%-18px)]"
            }`}
          />
        </div>
      </div>
      {description && (
        <span className="text-[10px] text-muted-foreground">
          {description}
        </span>
      )}
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary" />
      ))}
    </div>
  )
}
