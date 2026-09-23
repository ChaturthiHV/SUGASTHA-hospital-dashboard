import React, { useState } from 'react';
import { useHealthcare } from '../../context/HealthcareContext';
import { ESanjeevaniModal } from '../shared/eSanjeevaniModal';
import { 
  Building2,
  Users, 
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PhoneCall,
  Video,
  Bed,
  Stethoscope,
  BarChart,
  UserPlus
} from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { 
    appointments,
    hospitals,
    currentHospitalId,
    setCurrentHospitalId,
    acceptAppointment,
    rejectAppointmentAndEscalate,
    submitDoctorConsultation
  } = useHealthcare();

  const [activeTab, setActiveTab] = useState<'OPD' | 'IPD' | 'DOCTORS' | 'TELECONSULT' | 'ANALYTICS'>('OPD');
  const [activeTeleconsult, setActiveTeleconsult] = useState<string | null>(null);

  const activeHospital = hospitals.find(h => h.id === currentHospitalId) || hospitals[0];
  const hospitalQueue = appointments.filter((a: any) => a.hospitalId === activeHospital.id && a.status === 'PENDING_ACCEPTANCE');

  if (!activeHospital) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hospital Header Stats */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8 shadow-xl border-4 border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/50">
              <Building2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black">{activeHospital.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Wait Time: 15m</span>
                <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> {activeHospital.type}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl p-3 text-center min-w-[100px] border border-slate-700">
              <div className="text-3xl font-black text-emerald-400">{activeHospital.totalBeds}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Gen Beds</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center min-w-[100px] border border-slate-700">
              <div className="text-3xl font-black text-rose-400">{activeHospital.icuBedsAvailable}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">ICU Beds</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center min-w-[100px] border border-slate-700">
              <div className="text-3xl font-black text-sky-400">{Math.floor(activeHospital.totalBeds * 0.3)}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">O2 Beds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
        {[
          { id: 'OPD', label: 'OPD Queue', icon: <Users className="w-4 h-4" /> },
          { id: 'IPD', label: 'Bed Management', icon: <Bed className="w-4 h-4" /> },
          { id: 'DOCTORS', label: 'Doctor Roster', icon: <Stethoscope className="w-4 h-4" /> },
          { id: 'TELECONSULT', label: 'Telemedicine Desk', icon: <Video className="w-4 h-4" /> },
          { id: 'ANALYTICS', label: 'Analytics', icon: <BarChart className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
        {activeTab === 'OPD' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-4 flex justify-between items-center">
              Incoming OPD Queue
              <span className="bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full border border-rose-200">
                {hospitalQueue.length} Pending Requests
              </span>
            </h3>
            
            {hospitalQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                No incoming patients in the queue.
              </div>
            ) : (
              <div className="grid gap-4">
                {hospitalQueue.map((apt: any) => (
                  <div key={apt.id} className={`p-5 rounded-xl border-l-4 transition-all ${
                    apt.urgency === 'RED' ? 'border-l-rose-500 bg-rose-50/30 border-t border-r border-b border-rose-100' :
                    apt.urgency === 'YELLOW' ? 'border-l-amber-500 bg-amber-50/30 border-t border-r border-b border-amber-100' :
                    'border-l-emerald-500 bg-emerald-50/30 border-t border-r border-b border-emerald-100'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            apt.urgency === 'RED' ? 'bg-rose-100 text-rose-800' :
                            apt.urgency === 'YELLOW' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {apt.urgency} Priority
                          </span>
                          <span className="text-xs text-slate-500 font-mono">ID: {apt.patientId}</span>
                        </div>
                        <h4 className="font-bold text-slate-900">{apt.symptoms[0]}</h4>
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          apt.status === 'PENDING' ? 'bg-slate-200 text-slate-700 animate-pulse' :
                          apt.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'COMPLETED' ? 'bg-sky-100 text-sky-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {apt.status}
                        </span>
                        {apt.status === 'PENDING' && (
                          <div className="text-[10px] text-amber-600 mt-2 font-bold flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" /> Auto-reject in 12s
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {apt.symptoms.map((sym: string, i: number) => (
                        <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                          {sym}
                        </span>
                      ))}
                    </div>

                    {apt.status === 'PENDING' && (
                      <div className="mt-5 flex gap-3 pt-4 border-t border-slate-200/50">
                        <button 
                          onClick={() => acceptAppointment(apt.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded shadow-sm transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept Patient
                        </button>
                        <button 
                          onClick={() => rejectAppointmentAndEscalate(apt.id, 'No Bed Available')}
                          className="flex-1 bg-white hover:bg-rose-50 text-rose-600 font-bold py-2 px-4 rounded shadow-sm border border-rose-200 transition flex items-center justify-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" /> Reject (No Bed)
                        </button>
                      </div>
                    )}

                    {apt.status === 'ACCEPTED' && (
                      <div className="mt-5 pt-4 border-t border-slate-200/50">
                        <button 
                          onClick={() => submitDoctorConsultation(apt.id, {
                            consultationDate: new Date().toISOString(),
                            doctorId: apt.doctorId,
                            doctorName: apt.doctorName,
                            hospitalName: activeHospital.name,
                            department: apt.department,
                            chiefComplaints: apt.symptoms.join(', '),
                            clinicalObservations: 'Stable vitals',
                            diagnosis: 'General observation',
                            icd10Code: 'Z00.0',
                            medications: [],
                            labTestsOrdered: [],
                            advice: 'Prescribed paracetamol and complete rest. Follow up in 3 days.',
                            followUpDays: 3,
                            abhaSynced: true,
                            abhaTransactionId: `ABHA-TXN-${Date.now()}`
                          })}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded shadow-sm transition flex items-center justify-center gap-2"
                        >
                          <Stethoscope className="w-4 h-4" /> Complete Consultation & Sync to ABHA
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'IPD' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-4">Bed & Resource Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'General Ward', total: 120, available: activeHospital.totalBeds, color: 'emerald' },
                { title: 'ICU Beds', total: 20, available: activeHospital.icuBedsAvailable, color: 'rose' },
                { title: 'Oxygen Beds', total: 50, available: Math.floor(activeHospital.totalBeds * 0.3), color: 'sky' }
              ].map((ward, i) => (
                <div key={i} className={`border-2 border-${ward.color}-100 bg-${ward.color}-50/30 rounded-xl p-5`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">{ward.title}</h4>
                    <Bed className={`w-5 h-5 text-${ward.color}-500`} />
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className={`text-4xl font-black text-${ward.color}-600`}>{ward.available}</span>
                    <span className="text-sm text-slate-500 mb-1">/ {ward.total} Available</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className={`bg-${ward.color}-500 h-2.5 rounded-full`} style={{ width: `${(ward.available/ward.total)*100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h4 className="font-bold text-slate-800 mb-4">Recent IPD Admissions</h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Patient ID</th>
                      <th className="px-6 py-3">Ward</th>
                      <th className="px-6 py-3">Admission Time</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock admissions */}
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-mono font-medium">ABHA-2910-4821</td>
                      <td className="px-6 py-4">ICU</td>
                      <td className="px-6 py-4">10:42 AM</td>
                      <td className="px-6 py-4"><span className="text-rose-600 font-bold">Critical</span></td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-mono font-medium">ABHA-9938-1120</td>
                      <td className="px-6 py-4">General</td>
                      <td className="px-6 py-4">09:15 AM</td>
                      <td className="px-6 py-4"><span className="text-emerald-600 font-bold">Stable</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DOCTORS' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-slate-900">Doctor Roster & Availability</h3>
              <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                <UserPlus className="w-4 h-4" /> Add Doctor
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Dr. Sharma', spec: 'Cardiologist', status: 'ON_DUTY', load: 8 },
                { name: 'Dr. Gupta', spec: 'General Physician', status: 'IN_SURGERY', load: 12 },
                { name: 'Dr. Patel', spec: 'Pediatrician', status: 'ON_DUTY', load: 4 },
                { name: 'Dr. Reddy', spec: 'Orthopedic', status: 'OFF_DUTY', load: 0 }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-xs text-slate-500">{doc.spec}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      doc.status === 'ON_DUTY' ? 'bg-emerald-100 text-emerald-700' :
                      doc.status === 'IN_SURGERY' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {doc.status.replace('_', ' ')}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Load: {doc.load} patients</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'TELECONSULT' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-4">Telemedicine & eSanjeevani Desk</h3>
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <Video className="w-16 h-16 text-sky-500 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Remote Consultations</h4>
              <p className="text-sm text-slate-600 mb-6">Connect with rural patients and ASHA workers via the national eSanjeevani network.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTeleconsult('PATIENT-4912')}
                  className="w-full bg-white border-2 border-sky-600 hover:bg-sky-50 text-sky-700 font-bold py-3 px-6 rounded-xl shadow-sm transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><PhoneCall className="w-5 h-5 animate-pulse text-amber-500" /> Incoming call from ASHA Worker (Village: Rampur)</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Ringing...</span>
                </button>
              </div>
            </div>

            {activeTeleconsult && (
              <ESanjeevaniModal 
                isOpen={true} 
                onClose={() => setActiveTeleconsult(null)} 
                symptoms={['Fever']}
              />
            )}
          </div>
        )}

        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-4">Hospital Analytics & Load Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 mb-1">Total OPD Today</div>
                <div className="text-2xl font-black text-slate-900">428</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 mb-1">Avg Wait Time</div>
                <div className="text-2xl font-black text-slate-900">15 mins</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 mb-1">IPD Admissions</div>
                <div className="text-2xl font-black text-slate-900">32</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 mb-1">Teleconsults</div>
                <div className="text-2xl font-black text-slate-900">18</div>
              </div>
            </div>
            
            <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold">
              [ Chart: Patient Influx vs Capacity over 24h ]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
