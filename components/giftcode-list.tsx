"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Giftcode {
  code: string
  description: string
  rewards: string[]
  expiresAt: string
  status: "active" | "expired"
}

interface GiftcodeListProps {
  giftcodes: Giftcode[]
}

export function GiftcodeList({ giftcodes }: GiftcodeListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <div className="space-y-4">
      {giftcodes.map((giftcode) => {
        const expired = giftcode.status === "expired" || isExpired(giftcode.expiresAt)

        return (
          <Card
            key={giftcode.code}
            className={`border-border bg-card transition-all ${
              expired ? "opacity-60" : "hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                        expired ? "bg-muted" : "bg-primary/10"
                      }`}
                    >
                      🎁
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-lg font-bold text-foreground">{giftcode.code}</h3>
                        <Badge variant={expired ? "secondary" : "default"}>
                          {expired ? "Hết hạn" : "Còn hiệu lực"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{giftcode.description}</p>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {giftcode.rewards.map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                  </div>

                  {/* Expiry */}
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <span>🕐</span>
                    <span>Hết hạn: {formatDate(giftcode.expiresAt)}</span>
                  </div>
                </div>

                {/* Copy Button */}
                <Button
                  variant={expired ? "secondary" : "default"}
                  disabled={expired}
                  onClick={() => handleCopy(giftcode.code)}
                  className="gap-2"
                >
                  {copiedCode === giftcode.code ? (
                    <>
                      <span>✓</span>
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      Sao chép
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
