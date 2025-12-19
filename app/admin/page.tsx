"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { authApi, chatApi, giftcodeApi, donationApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, MessageSquare, TrendingUp, Crown, Activity, Loader2 } from "lucide-react";

interface DashboardStats {
  users: { total: number; active: number; banned: number; admins: number } | null;
  chat: { total: number; flagged: number; deleted: number; today: number } | null;
  giftcodes: { total: number; active: number; expired: number; used: number } | null;
  donation: { currentAmount: number; goalAmount: number; donorCount: number } | null;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    users: null,
    chat: null,
    giftcodes: null,
    donation: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all stats in parallel
      const [usersResult, chatResult, giftcodesResult, donationResult] = await Promise.allSettled([
        authApi.adminGetStats(token),
        chatApi.adminGetStats(token),
        giftcodeApi.adminStats(token),
        donationApi.getActive(),
      ]);

      setStats({
        users: usersResult.status === "fulfilled" ? usersResult.value : null,
        chat: chatResult.status === "fulfilled" ? chatResult.value : null,
        giftcodes: giftcodesResult.status === "fulfilled" ? giftcodesResult.value.stats : null,
        donation: donationResult.status === "fulfilled" && donationResult.value
          ? {
              currentAmount: donationResult.value.currentAmount || 0,
              goalAmount: donationResult.value.goalAmount || 0,
              donorCount: donationResult.value.donorCount || 0,
            }
          : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải thống kê...</span>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: stats.users?.total?.toLocaleString() || "0",
      change: `${stats.users?.active || 0} hoạt động`,
      icon: Users,
      description: `${stats.users?.banned || 0} bị khóa`,
    },
    {
      title: "Giftcode",
      value: stats.giftcodes?.total?.toString() || "0",
      change: `${stats.giftcodes?.active || 0} còn hiệu lực`,
      icon: Gift,
      description: `${stats.giftcodes?.expired || 0} hết hạn`,
    },
    {
      title: "Tin nhắn hôm nay",
      value: stats.chat?.today?.toLocaleString() || "0",
      change: `${stats.chat?.total || 0} tổng`,
      icon: MessageSquare,
      description: `${stats.chat?.flagged || 0} cần xem xét`,
    },
    {
      title: "Quyên góp",
      value: formatCurrency(stats.donation?.currentAmount || 0),
      change: `${stats.donation?.donorCount || 0} người`,
      icon: Crown,
      description: `Mục tiêu: ${formatCurrency(stats.donation?.goalAmount || 0)}`,
    },
  ];

  // Calculate percentages for progress bars
  const userActivityRate = stats.users?.total ? Math.round((stats.users.active / stats.users.total) * 100) : 0;
  const giftcodeUsedRate = stats.giftcodes?.total ? Math.round(((stats.giftcodes.used || 0) / stats.giftcodes.total) * 100) : 0;
  const donationProgress = stats.donation?.goalAmount ? Math.round((stats.donation.currentAmount / stats.donation.goalAmount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng trở lại! Đây là tổng quan về hệ thống.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.change}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts/Progress */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Activity className="h-5 w-5 text-primary" />
              Thống kê nhanh
            </CardTitle>
            <CardDescription>Tổng quan hiệu suất hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tỷ lệ người dùng hoạt động</span>
                  <span className="font-medium text-foreground">{userActivityRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${userActivityRate}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giftcode đã sử dụng</span>
                  <span className="font-medium text-foreground">{giftcodeUsedRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${giftcodeUsedRate}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mục tiêu quyên góp</span>
                  <span className="font-medium text-foreground">{Math.min(donationProgress, 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${Math.min(donationProgress, 100)}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <TrendingUp className="h-5 w-5 text-primary" />
              Chi tiết
            </CardTitle>
            <CardDescription>Thông tin chi tiết hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.users && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Admin</span>
                  <span className="font-medium">{stats.users.admins}</span>
                </div>
              )}
              {stats.chat && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tin nhắn đã xóa</span>
                  <span className="font-medium text-red-500">{stats.chat.deleted}</span>
                </div>
              )}
              {stats.giftcodes && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Giftcode còn hiệu lực</span>
                  <span className="font-medium text-green-500">{stats.giftcodes.active}</span>
                </div>
              )}
              {stats.donation && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Số người quyên góp</span>
                  <span className="font-medium text-primary">{stats.donation.donorCount}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
