"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Globe, Bell, Shield, Palette } from "lucide-react"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Onmyoji Fan Hub",
    siteDescription: "Cộng đồng fan Onmyoji lớn nhất Việt Nam",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    chatEnabled: true,
    forumEnabled: true,
    wikiEnabled: true,
    primaryColor: "#c41e3a",
    discordWebhook: "",
    telegramBotToken: "",
  })

  const handleSave = () => {
    // Save settings logic
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">Quản lý cấu hình chung của website</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Globe className="h-5 w-5 text-primary" />
              Cài đặt chung
            </CardTitle>
            <CardDescription>Thông tin cơ bản của website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Tên website</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Mô tả</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chế độ bảo trì</Label>
                <p className="text-xs text-muted-foreground">Tạm đóng website để bảo trì</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Shield className="h-5 w-5 text-primary" />
              Bảo mật
            </CardTitle>
            <CardDescription>Cài đặt đăng ký và xác thực</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cho phép đăng ký</Label>
                <p className="text-xs text-muted-foreground">Người dùng mới có thể tạo tài khoản</p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Xác thực email</Label>
                <p className="text-xs text-muted-foreground">Yêu cầu xác thực email khi đăng ký</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Settings className="h-5 w-5 text-primary" />
              Tính năng
            </CardTitle>
            <CardDescription>Bật/tắt các tính năng của website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chat Box</Label>
                <p className="text-xs text-muted-foreground">Cho phép người dùng chat realtime</p>
              </div>
              <Switch
                checked={settings.chatEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, chatEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Diễn đàn</Label>
                <p className="text-xs text-muted-foreground">Cho phép truy cập diễn đàn</p>
              </div>
              <Switch
                checked={settings.forumEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, forumEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Wiki</Label>
                <p className="text-xs text-muted-foreground">Cho phép truy cập wiki</p>
              </div>
              <Switch
                checked={settings.wikiEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, wikiEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Bell className="h-5 w-5 text-primary" />
              Thông báo
            </CardTitle>
            <CardDescription>Cấu hình webhook và bot thông báo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
              <Input
                id="discordWebhook"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={settings.discordWebhook}
                onChange={(e) => setSettings({ ...settings, discordWebhook: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegramBotToken">Telegram Bot Token</Label>
              <Input
                id="telegramBotToken"
                type="password"
                placeholder="Bot token..."
                value={settings.telegramBotToken}
                onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Palette className="h-5 w-5 text-primary" />
              Giao diện
            </CardTitle>
            <CardDescription>Tùy chỉnh màu sắc và giao diện</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Màu chủ đạo</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="h-10 w-20 cursor-pointer p-1"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-32 font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {["#c41e3a", "#d4af37", "#1a1a2e", "#4a90a4", "#7c3aed"].map((color) => (
                  <button
                    key={color}
                    className="h-8 w-8 rounded-full border-2 border-border transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    onClick={() => setSettings({ ...settings, primaryColor: color })}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
