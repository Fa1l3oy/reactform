import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  prefix: z.string().min(1, "กรุณาใส่คำนำหน้า"),
  firstName: z.string().min(1, "กรุณาใส่ชื่อ"),
  lastName: z.string().min(1, "กรุณาใส่นามสกุล"),
  ministry: z.string().optional(),
  department: z.string().optional(),
  history: z.string().optional(),
  works: z.string().optional(),
  party: z.string().optional(),
  photo: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const MPRegistry: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [members, setMembers] = useState<FormData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("members");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  // เซฟข้อมูลลง localStorage
  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  const onSubmit = (data: FormData) => {
    if (editIndex !== null) {
      const updated = [...members];
      updated[editIndex] = data;
      setMembers(updated);
      setEditIndex(null);
    } else {
      setMembers([...members, data]);
    }
    reset();
  };

  const handleEdit = (index: number) => {
    const member = members[index];
    Object.keys(member).forEach((key) => {
      setValue(key as keyof FormData, member[key as keyof FormData] as any);
    });
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        ทำเนียบสมาชิกสภาผู้แทนราษฎร
      </h1>

      {/* ฟอร์ม */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">คำนำหน้า</label>
            <input {...register("prefix")} className="w-full border rounded p-2" />
            {errors.prefix && <p className="text-red-500 text-sm">{errors.prefix.message}</p>}
          </div>

          <div>
            <label className="block font-medium">ชื่อ</label>
            <input {...register("firstName")} className="w-full border rounded p-2" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block font-medium">นามสกุล</label>
            <input {...register("lastName")} className="w-full border rounded p-2" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="block font-medium">ตำแหน่งรัฐมนตรี</label>
            <input {...register("ministry")} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block font-medium">กระทรวง</label>
            <input {...register("department")} className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium">ประวัติการทำงาน</label>
            <textarea {...register("history")} className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium">ผลงานที่ผ่านมา</label>
            <textarea {...register("works")} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block font-medium">สังกัดพรรคการเมือง</label>
            <input {...register("party")} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block font-medium">รูปถ่าย 2"</label>
            <input type="file" {...register("photo")} className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {editIndex !== null ? "บันทึกการแก้ไข" : "เพิ่มสมาชิก"}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              ล้างแบบฟอร์ม
            </button>
          </div>
        </form>
      </div>

      {/* ตารางสมาชิก */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">รายชื่อสมาชิก ({members.length})</h2>
        {members.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-2 border">ตำแหน่ง</th>
                  <th className="px-4 py-2 border">กระทรวง</th>
                  <th className="px-4 py-2 border">พรรค</th>
                  <th className="px-4 py-2 border">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, index) => (
                  <tr key={index} className="text-center hover:bg-gray-100">
                    <td className="px-4 py-2 border">
                      {m.prefix} {m.firstName} {m.lastName}
                    </td>
                    <td className="px-4 py-2 border">{m.ministry}</td>
                    <td className="px-4 py-2 border">{m.department}</td>
                    <td className="px-4 py-2 border">{m.party}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MPRegistry;
