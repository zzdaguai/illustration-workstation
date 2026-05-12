import React, { useMemo, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Wand2,
  Download,
  Sparkles,
  Settings2,
  Trash2,
  Plus,
  CheckCircle2,
  Loader2,
  Palette,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BatchIllustrationWorkstation() {
  const [styleImage, setStyleImage] = useState(null);
  const [sourceImages, setSourceImages] = useState([]);
  const [prompt, setPrompt] = useState(
    "保持参考图的插画风格、线条、配色、光影和质感；只改变主体内容，不添加无关元素。输出高清商业插画。"
  );
  const [ratio, setRatio] = useState("1:1");
  const [strength, setStrength] = useState(80);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);

  const canGenerate = styleImage && sourceImages.length > 0 && prompt.trim().length > 0;

  const handleStyleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStyleImage({ file, url: URL.createObjectURL(file), name: file.name });
  };

  const handleSourceUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const mapped = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      status: "waiting",
    }));
    setSourceImages((prev) => [...prev, ...mapped]);
  };

  const removeSource = (id) => {
    setSourceImages((prev) => prev.filter((item) => item.id !== id));
    setResults((prev) => prev.filter((item) => item.sourceId !== id));
  };

  const clearAll = () => {
    setSourceImages([]);
    setResults([]);
  };

  const downloadImage = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `illustration-${name || "result"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

const generateMockResults = async () => {
  if (!canGenerate) return;

  setIsGenerating(true);
  setResults([]);

  try {
    const newResults = [];

    for (const item of sourceImages) {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${prompt}。参考图风格统一，主体内容来自上传素材。`,
        }),
      });

      const data = await response.json();

      newResults.push({
        id: crypto.randomUUID(),
        sourceId: item.id,
        sourceName: item.name,
        url: data.imageUrl,
      });
    }

    setResults(newResults);
  } catch (error) {
    console.error(error);
    alert("生成失败");
  }

  setIsGenerating(false);
};

  const progress = useMemo(() => {
    if (sourceImages.length === 0) return 0;
    const done = sourceImages.filter((item) => item.status === "done").length;
    return Math.round((done / sourceImages.length) * 100);
  }, [sourceImages]);

  return (
    <div className="min-h-screen bg-[#070B16] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles className="h-4 w-4" />
                AI Illustration Batch Studio
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                批量生成同风格插画工作站
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                上传一张参考风格图，再上传多张素材图，统一控制风格强度、画幅比例和生成提示词。当前版本为网页原型，可继续接入生图 API 做成真正的批量插画工具。
              </p>
            </div>

            <button
              onClick={generateMockResults}
              disabled={!canGenerate || isGenerating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-7 py-4 font-bold text-slate-950 shadow-lg shadow-cyan-300/20 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300 disabled:hover:translate-y-0"
            >
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
              {isGenerating ? "生成中..." : "开始批量生成"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[370px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-cyan-200" />
                <h2 className="text-lg font-bold">1. 参考风格图</h2>
              </div>

              <label className="flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-slate-950/60 p-4 text-center transition hover:border-cyan-200/70 hover:bg-slate-900/80">
                {styleImage ? (
                  <div className="w-full">
                    <img
                      src={styleImage.url}
                      alt="style reference"
                      className="mx-auto max-h-52 rounded-2xl object-contain"
                    />
                    <p className="mt-3 truncate text-xs text-slate-400">{styleImage.name}</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-slate-300">
                    <Upload className="mx-auto h-10 w-10 text-cyan-200" />
                    <p className="font-semibold">上传一张风格参考图</p>
                    <p className="text-xs text-slate-400">用于统一线条、颜色、质感和构图气质</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleStyleUpload} className="hidden" />
              </label>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-cyan-200" />
                <h2 className="text-lg font-bold">2. 生成设置</h2>
              </div>

              <label className="mb-4 block">
                <span className="mb-2 block text-sm text-slate-300">统一提示词</span>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-36 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-white outline-none ring-cyan-200/40 focus:ring-2"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-2 block text-sm text-slate-300">画幅比例</span>
                <select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm outline-none ring-cyan-200/40 focus:ring-2"
                >
                  <option>1:1</option>
                  <option>3:4</option>
                  <option>4:3</option>
                  <option>9:16</option>
                  <option>16:9</option>
                </select>
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between text-sm text-slate-300">
                  <span>风格相似度</span>
                  <span>{strength}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={strength}
                  onChange={(e) => setStrength(Number(e.target.value))}
                  className="w-full accent-cyan-300"
                />
              </label>
            </section>
          </aside>

          <main className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-cyan-200" />
                    <h2 className="text-lg font-bold">3. 批量素材图</h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">一次上传多张图片，系统会按照同一个风格逐张生成。</p>
                </div>
                <div className="flex gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15">
                    <Plus className="h-4 w-4" />
                    添加图片
                    <input type="file" accept="image/*" multiple onChange={handleSourceUpload} className="hidden" />
                  </label>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    清空
                  </button>
                </div>
              </div>

              {sourceImages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/50 p-12 text-center text-slate-400">
                  <ImageIcon className="mx-auto mb-3 h-10 w-10 text-slate-500" />
                  还没有素材图。请上传需要转换成统一插画风格的图片。
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {sourceImages.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70"
                    >
                      <div className="relative aspect-square bg-slate-900">
                        <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                        <button
                          onClick={() => removeSource(item.id)}
                          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3">
                        <p className="truncate text-sm text-slate-300">{item.name}</p>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">
                          {item.status === "waiting" && "等待"}
                          {item.status === "generating" && "生成中"}
                          {item.status === "done" && "完成"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold">4. 生成结果</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    当前进度：{progress}% ｜比例：{ratio} ｜风格相似度：{strength}%
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15">
                  <Download className="h-4 w-4" />
                  打包下载
                </button>
              </div>

              {results.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/50 p-12 text-center text-slate-400">
                  生成后，结果会显示在这里。当前版本用素材图模拟预览，方便先确认网站流程。
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="overflow-hidden rounded-3xl border border-cyan-200/20 bg-slate-950/70"
                    >
                      <div className="relative aspect-square bg-slate-900">
                        <img src={item.url} alt={item.sourceName} className="h-full w-full object-cover" />
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Done
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3">
                        <p className="truncate text-sm text-slate-300">{item.sourceName}</p>
                        <button
                          onClick={() => downloadImage(item.url, item.sourceName)}
                          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/15"
                        >
                          下载
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
