import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, FileText, Users } from "lucide-react";

const NDAGateway: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = () => {
    if (!isChecked) return;

    setIsSubmitting(true);
    sessionStorage.setItem('nda-consent', 'accepted');
    sessionStorage.setItem('nda-consent-timestamp', new Date().toISOString());

    setTimeout(() => {
      onAccept();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">開発中プロトタイプ - 関係者限定</h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                    <Shield className="w-6 h-6 text-amber-700" />
                  </div>
                  <p className="text-base text-slate-700 leading-relaxed">
                    本システムは<strong className="text-slate-900">東レ工業株式会社</strong>様向けに<br />
                    <strong className="text-slate-900">株式会社SHINWA</strong>が開発中のプロトタイプです。
                  </p>
                  <div className="text-left space-y-3 mt-6 max-w-md mx-auto">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                      <p className="text-sm text-slate-600">アクセスは許可された関係者に限定されています</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                      <p className="text-sm text-slate-600">無断での第三者への開示・共有はお控えください</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                      <p className="text-sm text-slate-600">本画面のスクリーンショットや録画もご遠慮ください</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="nda-accept"
                    checked={isChecked}
                    onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="nda-accept"
                      className="text-base font-medium text-slate-900 cursor-pointer hover:text-amber-700 transition-colors"
                    >
                      内容を確認しました
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleAccept}
                  disabled={!isChecked || isSubmitting}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      処理中...
                    </span>
                  ) : (
                    "システムに入る"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NDAGateway;