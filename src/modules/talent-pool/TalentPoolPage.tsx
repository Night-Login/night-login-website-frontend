"use client";

import { useState, useMemo } from "react";
import { Layout } from "@/components/Layouts/DefaultLayout";
import Card from "@/modules/talent-pool/components/Card";
import Modal from "@/modules/talent-pool/components/Modal";
import type { Member } from "@/modules/talent-pool/data/TalentData";

import { MEMBERS, SKILLS } from "@/modules/talent-pool/data/members";

export default function TalentPool() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modal state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filter members based on search term and filters
  const filteredMembers = useMemo(() => {
    let result = MEMBERS;

    if (searchTerm) {
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedSkill) {
      result = result.filter((member) =>
        member.skills.some((skill) => skill.name === selectedSkill),
      );
    }

    if (selectedCategory) {
      result = result.filter((member) =>
        member.skills.some((skill) => skill.category === selectedCategory),
      );
    }

    return result;
  }, [searchTerm, selectedSkill, selectedCategory]);

  return (
    <Layout>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Talent Pool</h1>

        {/* Search and Filter Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by name, role, or description"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              {/* Accessible label for skill select (visually hidden) */}
              <label htmlFor="skillSelect" className="sr-only">
                Filter by skill
              </label>
              <select
                id="skillSelect"
                aria-label="Filter by skill"
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                value={selectedSkill || ""}
                onChange={(e) => setSelectedSkill(e.target.value || null)}
              >
                <option value="">Filter by skill</option>
                {SKILLS.map((skill) => (
                  <option key={skill.id} value={skill.name}>
                    {skill.name}
                  </option>
                ))}
              </select>

              {/* Accessible label for category select (visually hidden) */}
              <label htmlFor="categorySelect" className="sr-only">
                Filter by category
              </label>
              <select
                id="categorySelect"
                aria-label="Filter by category"
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Filter by category</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
                <option value="ai-ml">AI/ML</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Talent Pool Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Talent Pool</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredMembers.map((member) => (
              <Card key={member.id} member={member} onClick={handleOpenModal} />
            ))}
          </div>
        </section>

        {selectedMember && (
          <Modal
            member={selectedMember}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </Layout>
  );
}
