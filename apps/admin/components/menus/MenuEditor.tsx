"use client";

import type { MenuCategory } from "@/lib/types";

type MenuEditorProps = {
  menus: MenuCategory[];
  onChangeItem: (categoryIndex: number, itemIndex: number, patch: { name?: string; price?: number; min?: number }) => void;
  onAddItem: (categoryIndex: number) => void;
  onRemoveItem: (categoryIndex: number, itemIndex: number) => void;
};

export default function MenuEditor({ menus, onChangeItem, onAddItem, onRemoveItem }: MenuEditorProps) {
  return (
    <section className="mx-auto grid max-w-[1010px] gap-4">
      <div className="mb-2">
        <h2 className="m-0 font-['Outfit'] text-[28px] font-bold leading-tight">メニュー・料金の編集</h2>
        <p className="mt-2 text-[#6b7280]">価格・所要時間はユーザー予約ページに反映される想定です（プロトタイプではこのセッション内のみ）。</p>
      </div>
      <div className="grid gap-[30px]">
        {menus.map((category, categoryIndex) => (
          <section className="grid gap-2.5" key={category.id}>
            <div className="flex items-center justify-between">
              <h3 className="m-0 text-base font-bold">{category.name}</h3>
              <button className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#d7dbe0] bg-white px-4 py-2 font-bold text-[#1f2328]" onClick={() => onAddItem(categoryIndex)}>＋ メニュー追加</button>
            </div>
            <article className="overflow-hidden rounded-[10px] border border-[#e1e4e8] bg-white shadow-[0_16px_44px_-38px_rgba(31,35,40,.55)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] table-fixed border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="h-[58px] border-b border-[#e1e4e8] bg-[#f7f8fa] px-7 text-left text-xs font-bold tracking-[.04em] text-[#6b7280]">メニュー名</th>
                      <th className="h-[58px] w-[180px] border-b border-[#e1e4e8] bg-[#f7f8fa] px-3 text-left text-xs font-bold tracking-[.04em] text-[#6b7280]">料金（税込）</th>
                      <th className="h-[58px] w-[150px] border-b border-[#e1e4e8] bg-[#f7f8fa] px-3 text-left text-xs font-bold tracking-[.04em] text-[#6b7280]">所要時間</th>
                      <th className="h-[58px] w-[72px] border-b border-[#e1e4e8] bg-[#f7f8fa] px-3 text-center text-xs font-bold tracking-[.04em] text-[#6b7280]">削除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, itemIndex) => (
                      <tr key={item.id}>
                        <td className="h-[68px] border-b border-[#e1e4e8] px-7 align-middle">
                          <input
                            className="h-10 w-full rounded-lg border border-transparent bg-white px-0 font-bold text-[#1f2328] outline-none focus:border-[#9aa3af] focus:px-3 focus:ring-4 focus:ring-[#8b93a1]/15"
                            value={item.name}
                            onChange={(event) => onChangeItem(categoryIndex, itemIndex, { name: event.target.value })}
                          />
                        </td>
                        <td className="h-[68px] w-[180px] border-b border-[#e1e4e8] px-3 align-middle">
                          <span className="flex w-[150px] items-center gap-2">
                            <span className="shrink-0 text-sm text-[#8b93a1]">¥</span>
                            <input
                              className="h-10 min-w-0 flex-1 rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-3 text-[#1f2328] outline-none focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15"
                              type="number"
                              value={item.price}
                              onChange={(event) => onChangeItem(categoryIndex, itemIndex, { price: Number(event.target.value) || 0 })}
                            />
                          </span>
                        </td>
                        <td className="h-[68px] w-[150px] border-b border-[#e1e4e8] px-3 align-middle">
                          <span className="flex w-[120px] items-center gap-2">
                            <input
                              className="h-10 min-w-0 flex-1 rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-3 text-[#1f2328] outline-none focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15"
                              type="number"
                              value={item.min}
                              onChange={(event) => onChangeItem(categoryIndex, itemIndex, { min: Number(event.target.value) || 0 })}
                            />
                            <span className="shrink-0 text-sm text-[#8b93a1]">分</span>
                          </span>
                        </td>
                        <td className="h-[68px] w-[72px] border-b border-[#e1e4e8] px-3 text-center align-middle">
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8a8a8] bg-[#f3e3e3] font-bold text-[#a13d3d]" onClick={() => onRemoveItem(categoryIndex, itemIndex)} aria-label={`${item.name}を削除`}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        ))}
      </div>
    </section>
  );
}
