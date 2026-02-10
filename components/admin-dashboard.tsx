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
} from "lucide-react"
import type { Article, SiteSettings, SocialProofItem } from "@/lib/data"

type Tab = "settings" | "posts" | "social-proof"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("posts")

  const tabs = [
    { key: "settings" as Tab, label: "اعدادات الموقع", icon: <Settings className="h-4 w-4" /> },
    { key: "posts" as Tab, label: "ادارة المقالات", icon: <FileText className="h-4 w-4" /> },
    { key: "social-proof" as Tab, label: "اشعارات اجتماعية", icon: <Users className="h-4 w-4" /> },
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
              <h1 className="text-sm font-bold text-foreground">لوحة التحكم</h1>
              <p className="text-[10px] text-muted-foreground">Vorqenox Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive"
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
                  : "border border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
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
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SiteSettingsPanel />
            </motion.div>
          )}
          {activeTab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PostManager />
            </motion.div>
          )}
          {activeTab === "social-proof" && (
            <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SocialProofEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---- Site Settings Panel ----
function SiteSettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    setSaving(false)
  }

  if (!settings) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <SectionCard title="هوية الموقع" icon={<Globe className="h-4 w-4" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">اسم الموقع</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">رابط الشعار</label>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
              placeholder="https://..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Color Picker */}
      <SectionCard title="لون النيون" icon={<Palette className="h-4 w-4" />}>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={settings.neonColor}
            onChange={(e) => setSettings({ ...settings, neonColor: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-lg border border-border bg-secondary"
          />
          <input
            type="text"
            value={settings.neonColor}
            onChange={(e) => setSettings({ ...settings, neonColor: e.target.value })}
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
      <SectionCard title="روابط التواصل" icon={<LinkIcon className="h-4 w-4" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["twitter", "telegram", "youtube", "instagram"] as const).map((key) => (
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
                    socialLinks: { ...settings.socialLinks, [key]: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                dir="ltr"
                placeholder={`https://${key}.com/...`}
              />
            </div>
          ))}
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
function PostManager() {
  const [articles, setArticles] = useState<Article[]>([])
  const [editing, setEditing] = useState<Article | null>(null)
  const [isNew, setIsNew] = useState(false)

  const loadArticles = useCallback(async () => {
    const res = await fetch("/api/articles")
    setArticles(await res.json())
  }, [])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const handleSave = async (article: Article) => {
    if (isNew) {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      })
    } else {
      await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      })
    }
    setEditing(null)
    setIsNew(false)
    loadArticles()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/articles/${id}`, { method: "DELETE" })
    loadArticles()
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">المقالات</h2>
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

      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-sm font-bold text-primary">
                {article.title.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate" dir="ltr">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                  {article.category}
                </span>
                {article.isFeatured && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-500">
                    مميز
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing(article)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                aria-label="Edit article"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(article.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive"
                aria-label="Delete article"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
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
  const [form, setForm] = useState(article)

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
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
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          الغاء
        </button>
      </div>

      <SectionCard title="المعلومات الأساسية" icon={<FileText className="h-4 w-4" />}>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">العنوان</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value)
                if (!article.id) update("slug", generateSlug(e.target.value))
              }}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">الرابط المختصر</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">المحتوى</label>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
              dir="ltr"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">التصنيف</label>
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
              <label className="mb-1.5 block text-xs text-muted-foreground">رابط التحميل</label>
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
        </div>
      </SectionCard>

      {/* Toggles */}
      <SectionCard title="خيارات" icon={<Settings className="h-4 w-4" />}>
        <div className="flex flex-wrap gap-4">
          <ToggleSwitch
            label="مميز"
            checked={form.isFeatured}
            onChange={(v) => update("isFeatured", v)}
          />
          <ToggleSwitch
            label="اعلانات"
            checked={form.enableAds}
            onChange={(v) => update("enableAds", v)}
          />
          <ToggleSwitch
            label="مؤقت"
            checked={form.enableTimer}
            onChange={(v) => update("enableTimer", v)}
          />
          <ToggleSwitch
            label="قفل فيروسي"
            checked={form.enableViralLock}
            onChange={(v) => update("enableViralLock", v)}
          />
        </div>
      </SectionCard>

      {/* Specs */}
      <SectionCard title="المواصفات" icon={<FileText className="h-4 w-4" />}>
        <div className="space-y-3">
          {form.specs.map((spec, i) => (
            <div key={i} className="flex gap-3">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive"
                aria-label="Remove spec"
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

      <button
        type="button"
        onClick={() => onSave(form)}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90"
      >
        <Save className="h-4 w-4" />
        حفظ المقال
      </button>
    </div>
  )
}

// ---- Social Proof Editor ----
function SocialProofEditor() {
  const [items, setItems] = useState<SocialProofItem[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then(setItems)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/social-proof", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">الاشعارات الاجتماعية</h2>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          اشعار جديد
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {"اشعار رقم "}{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-xs text-destructive hover:underline"
              >
                حذف
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">الاسم</label>
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
                <label className="mb-1 block text-[10px] text-muted-foreground">نوع البطاقة</label>
                <input
                  type="text"
                  value={item.giftCardType}
                  onChange={(e) => updateItem(i, "giftCardType", e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  dir="ltr"
                  placeholder="Amazon Gift Card"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">السعر</label>
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
                <label className="mb-1 block text-[10px] text-muted-foreground">الوقت</label>
                <input
                  type="text"
                  value={item.timeAgo}
                  onChange={(e) => updateItem(i, "timeAgo", e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  dir="ltr"
                  placeholder="2 min ago"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
    >
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform ${
            checked ? "right-0.5" : "right-[calc(100%-18px)]"
          }`}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
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
