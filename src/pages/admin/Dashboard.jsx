import React, { useState, useEffect } from "react";
import { Member } from "../../entities/Member";
import { Program } from "../../entities/Program";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Users, UserCheck, Clock, BookOpen, Mail, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0, pendingMembers: 0, totalPrograms: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [m, p] = await Promise.all([Member.list('-created_date'), Program.list('-created_date')]);
      setMembers(m); setPrograms(p);
      const activeMembers = m.filter(x => x.status === 'active').length;
      const pendingMembers = m.filter(x => x.status === 'pending').length;
      setStats({ totalMembers: m.length, activeMembers, pendingMembers, totalPrograms: p.length });
    } catch (e) {
      console.error("Error loading data:", e);
    }
    setIsLoading(false);
  };

  const updateMemberStatus = async (id, newStatus) => {
    try { await Member.update(id, { status: newStatus }); loadData(); }
    catch (e) { console.error("Error updating member status:", e); alert(e.message || String(e)); }
  };

  const getStatusColor = (s) => s==='active' ? 'bg-green-100 text-green-800' : s==='pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';

  const getProgramCategoryColor = (c) => ({
    leadership:'bg-blue-100 text-blue-800',
    community_service:'bg-green-100 text-green-800',
    mentorship:'bg-purple-100 text-purple-800',
    workshops:'bg-orange-100 text-orange-800',
    events:'bg-pink-100 text-pink-800',
    sports:'bg-red-100 text-red-800',
    arts:'bg-yellow-100 text-yellow-800',
    general:'bg-gray-100 text-gray-800'
  }[c] || 'bg-gray-100 text-gray-800');

  const signOut = async () => { await supabase.auth.signOut(); window.location.hash = '#/admin/login?signout=1'; };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your youth organization's members and programs</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-sm text-gray-600 hover:underline">View website</Link>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label:'Total Members', value:stats.totalMembers, icon:<Users className="w-6 h-6 text-blue-600"/>, ring:'bg-blue-100' },
          { label:'Active Members', value:stats.activeMembers, icon:<UserCheck className="w-6 h-6 text-green-600"/>, ring:'bg-green-100' },
          { label:'Pending Applications', value:stats.pendingMembers, icon:<Clock className="w-6 h-6 text-yellow-600"/>, ring:'bg-yellow-100' },
          { label:'Active Programs', value:stats.totalPrograms, icon:<BookOpen className="w-6 h-6 text-purple-600"/>, ring:'bg-purple-100' },
        ].map((c,i)=>(
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 * (i+1) }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{c.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{c.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${c.ring} rounded-lg flex items-center justify-center`}>{c.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="members" className="flex items-center gap-2"><Users className="w-4 h-4" />Members ({stats.totalMembers})</TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Programs ({stats.totalPrograms})</TabsTrigger>
          </TabsList>

          {/* Members */}
          <TabsContent value="members">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Member Management</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.length ? members.map((member, idx)=>(
                    <motion.div key={member.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: idx*0.05 }} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{member.full_name}</h3>
                            <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                            {member.age && <Badge variant="outline">Age: {member.age}</Badge>}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{member.email}</div>
                            {member.phone && <div className="flex items-center gap-1"><Phone className="w-4 h-4" />{member.phone}</div>}
                            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined: {new Date(member.created_date).toLocaleDateString()}</div>
                          </div>

                          {member.program_interests?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {member.program_interests.map((i) => <Badge key={i} variant="secondary" className="text-xs">{i.replace(/_/g,' ')}</Badge>)}
                            </div>
                          )}

                          {member.join_reason && (
                            <p className="text-sm text-gray-700 italic">
                              "{member.join_reason.substring(0, 150)}{member.join_reason.length > 150 ? '...' : ''}"
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {member.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => updateMemberStatus(member.id, 'active')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                              <Button size="sm" variant="outline" onClick={() => updateMemberStatus(member.id, 'inactive')}>Decline</Button>
                            </>
                          )}
                          {member.status === 'active' && (
                            <Button size="sm" variant="outline" onClick={() => updateMemberStatus(member.id, 'inactive')}>Deactivate</Button>
                          )}
                          {member.status === 'inactive' && (
                            <Button size="sm" onClick={() => updateMemberStatus(member.id, 'active')} className="bg-blue-600 hover:bg-blue-700">Reactivate</Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Yet</h3>
                      <p className="text-gray-600">Members will appear here when they apply on your website.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Programs */}
          <TabsContent value="programs">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />Program Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.length ? programs.map((program, idx)=>(
                    <motion.div key={program.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: idx*0.05 }} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{program.title}</h3>
                            <Badge className={getProgramCategoryColor(program.category)}>{program.category.replace(/_/g,' ')}</Badge>
                            {program.is_active ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}
                          </div>
                          <p className="text-gray-700 mb-3">{program.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {program.duration && <div className="flex items-center gap-1"><Clock className="w-4 h-4" />Duration: {program.duration}</div>}
                            {program.meeting_schedule && <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{program.meeting_schedule}</div>}
                            {program.max_participants && <div className="flex items-center gap-1"><Users className="w-4 h-4" />{program.current_participants || 0} / {program.max_participants} participants</div>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Programs Yet</h3>
                      <p className="text-gray-600 mb-4">Create programs to start organizing activities.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">Create First Program</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
