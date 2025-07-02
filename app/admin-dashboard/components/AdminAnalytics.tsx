'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { format, subDays } from 'date-fns';
import { FiUsers, FiAward, FiMapPin, FiClock, FiRefreshCw } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
interface StudentStatusData {
  status: string;
  count: number;
  color: string;
  percentage: number;
}

interface UniversityData {
  name: string;
  student_count: number;
  percentage: number;
}

interface CountryData {
  country: string;
  code: string;
  student_count: number;
  percentage: number;
}

interface TimeRange {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

interface EnrollmentData {
  date: string;
  count: number;
}

type StudentStatus = 'applied' | 'accepted' | 'enrolled' | 'graduated' | 'withdrawn' | 'pending';

// Status colors mapping
const statusColors: Record<StudentStatus, string> = {
  'applied': '#F59E0B',
  'accepted': '#10B981',
  'enrolled': '#3B82F6',
  'graduated': '#8B5CF6',
  'withdrawn': '#6B7280',
  'pending': '#F59E0B',
};

// StatsCard Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace(/\d+$/, '')} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    {trend !== 'neutral' && (
      <div className="mt-2 flex items-center">
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last period</span>
      </div>
    )}
  </div>
);

// Generate mock student profiles
const generateMockStudentProfiles = (count: number) => {
  const statuses: StudentStatus[] = ['applied', 'accepted', 'enrolled', 'graduated', 'withdrawn', 'pending'];
  const countries = [
    { country: 'United States', code: 'US' },
    { country: 'United Kingdom', code: 'GB' },
    { country: 'Canada', code: 'CA' },
    { country: 'Australia', code: 'AU' },
    { country: 'Germany', code: 'DE' },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `student-${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    university_id: `univ-${Math.floor(Math.random() * 10) + 1}`,
    country: countries[Math.floor(Math.random() * countries.length)].country,
    created_at: subDays(new Date(), Math.floor(Math.random() * 365)).toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

const AdminAnalytics = () => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('analytics', 'can_edit');
  const supabase = createClient();
  
  // Time range options
  const timeRanges: TimeRange[] = [
    { label: 'Last 7 days', value: '7d', startDate: subDays(new Date(), 7), endDate: new Date() },
    { label: 'Last 30 days', value: '30d', startDate: subDays(new Date(), 30), endDate: new Date() },
    { label: 'Last 90 days', value: '90d', startDate: subDays(new Date(), 90), endDate: new Date() },
    { label: 'Last 12 months', value: '12m', startDate: subDays(new Date(), 365), endDate: new Date() },
    { label: 'All time', value: 'all', startDate: new Date(0), endDate: new Date() },
  ];

  // State for data
  const [studentStatusData, setStudentStatusData] = useState<StudentStatusData[]>([]);
  const [topUniversities, setTopUniversities] = useState<UniversityData[]>([]);
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[1]);
  const [useMockData, setUseMockData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derived state
  const totalStudents = studentStatusData.reduce((sum, item) => sum + item.count, 0);
  const activeUniversities = topUniversities.length;
  const topCountry = countriesData[0]?.country || '';
  const avgProcessingTime = '2.5'; // Mock value

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (useMockData) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        // Generate mock data
        const mockStudents = generateMockStudentProfiles(100);
        
        // Process student status data
        const statusCounts = mockStudents.reduce<Record<StudentStatus, number>>((acc, student) => {
          acc[student.status] = (acc[student.status] || 0) + 1;
          return acc;
        }, {} as Record<StudentStatus, number>);

        const total = mockStudents.length;
        const studentStatuses = Object.entries(statusCounts).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
          percentage: parseFloat(((count / total) * 100).toFixed(1)),
          color: statusColors[status as StudentStatus] || '#6B7280',
        }));

        setStudentStatusData(studentStatuses);
        
        // Mock university data
        const mockUniversities: UniversityData[] = [
          { name: 'University A', student_count: 350, percentage: 35 },
          { name: 'University B', student_count: 250, percentage: 25 },
          { name: 'University C', student_count: 150, percentage: 15 },
          { name: 'University D', student_count: 100, percentage: 10 },
          { name: 'University E', student_count: 100, percentage: 10 },
        ];
        
        setTopUniversities(mockUniversities);
        
        // Mock country data
        const mockCountries: CountryData[] = [
          { country: 'United States', code: 'US', student_count: 350, percentage: 35 },
          { country: 'United Kingdom', code: 'GB', student_count: 250, percentage: 25 },
          { country: 'Canada', code: 'CA', student_count: 150, percentage: 15 },
          { country: 'Australia', code: 'AU', student_count: 100, percentage: 10 },
          { country: 'Germany', code: 'DE', student_count: 100, percentage: 10 },
        ];
        
        setCountriesData(mockCountries);
        
        // Mock enrollment data
        const mockEnrollment = Array.from({ length: 30 }, (_, i) => ({
          date: format(subDays(new Date(), 29 - i), 'MMM dd'),
          count: Math.floor(Math.random() * 50) + 20,
        }));
        
        setEnrollmentData(mockEnrollment);
        
      } else {
        // First, let's check the available columns in the student table
        const { data: studentColumns, error: columnsError } = await supabase
          .from('student')
          .select('*')
          .limit(1);
          
        if (columnsError) {
          console.error('Error fetching student table structure:', columnsError);
          throw new Error('Could not fetch student data structure');
        }
        
        // Log the first student record to see available fields
        console.log('Student record sample:', studentColumns?.[0]);
        
        // Fetch student data with only the available columns
        const { data: studentsData, error: studentsError } = await supabase
          .from('student')
          .select('*');

        if (studentsError) throw studentsError;

        // Check if we have any student data
        if (!studentsData || studentsData.length === 0) {
          console.log('No student data found');
          setStudentStatusData([]);
          setTopUniversities([]);
          setCountriesData([]);
          setEnrollmentData([]);
          return;
        }

        // Log the first student record to see available fields
        console.log('Processing student data. First record:', studentsData[0]);

        // Get all available fields from the first student record
        const studentFields = Object.keys(studentsData[0]);
        console.log('Available student fields:', studentFields);

        // Process student status data if status field exists
        let studentStatuses: StudentStatusData[] = [];
        if (studentFields.includes('status')) {
          const statusCounts = studentsData.reduce<Record<string, number>>((acc, student) => {
            const status = (student.status || 'unknown').toLowerCase() as StudentStatus;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const total = studentsData.length;
          studentStatuses = Object.entries(statusCounts).map(([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count,
            percentage: parseFloat(((count / total) * 100).toFixed(1)),
            color: statusColors[status as StudentStatus] || '#6B7280',
          }));
        }
        setStudentStatusData(studentStatuses);

        // Process university data if university-related fields exist
        let universitiesWithCounts: UniversityData[] = [];
        const hasUniversityField = studentFields.some(field => 
          field.toLowerCase().includes('university') || 
          field.toLowerCase().includes('school') ||
          field.toLowerCase().includes('college')
        );

        if (hasUniversityField) {
          // Try to find the university field name
          const universityField = studentFields.find(field => 
            field.toLowerCase().includes('university') || 
            field.toLowerCase().includes('school') ||
            field.toLowerCase().includes('college')
          );

          if (universityField) {
            const universityCounts = studentsData.reduce<Record<string, number>>((acc, student) => {
              const university = student[universityField];
              if (university) {
                acc[university] = (acc[university] || 0) + 1;
              }
              return acc;
            }, {});

            universitiesWithCounts = Object.entries(universityCounts)
              .map(([name, student_count]) => ({
                name,
                student_count,
                percentage: parseFloat(((student_count / studentsData.length) * 100).toFixed(1)),
              }))
              .sort((a, b) => b.student_count - a.student_count)
              .slice(0, 5);
          }
        }
        setTopUniversities(universitiesWithCounts);

        // Process country data if country field exists
        let countriesWithCounts: CountryData[] = [];
        const countryField = studentFields.find(field => 
          field.toLowerCase().includes('country') || 
          field.toLowerCase().includes('nationality')
        );

        if (countryField) {
          const countryCounts = studentsData.reduce<Record<string, { count: number; code: string }>>((acc, student) => {
            const country = student[countryField];
            if (country) {
              const countryName = String(country);
              if (!acc[countryName]) {
                acc[countryName] = { 
                  count: 0, 
                  code: countryName.substring(0, 2).toUpperCase() 
                };
              }
              acc[countryName].count += 1;
            }
            return acc;
          }, {});

          countriesWithCounts = Object.entries(countryCounts)
            .map(([country, { count, code }]) => ({
              country,
              code,
              student_count: count,
              percentage: parseFloat(((count / studentsData.length) * 100).toFixed(1)),
            }))
            .sort((a, b) => b.student_count - a.student_count)
            .slice(0, 5);
        }
        setCountriesData(countriesWithCounts);

        // Generate enrollment data for the last 30 days
        const enrollmentByDay: Record<string, number> = {};
        const today = new Date();
        
        // Initialize last 30 days with 0 counts
        for (let i = 29; i >= 0; i--) {
          const date = subDays(today, i);
          const dateStr = format(date, 'MMM dd');
          enrollmentByDay[dateStr] = 0;
        }

        // Find the created_at field (could be created_at, createdAt, date_created, etc.)
        const dateField = studentFields.find(field => 
          ['created_at', 'createdat', 'date_created', 'datecreated', 'created'].includes(field.toLowerCase())
        );

        if (dateField) {
          // Count enrollments per day
          studentsData.forEach(student => {
            const dateValue = student[dateField];
            if (dateValue) {
              try {
                const createdDate = new Date(dateValue);
                if (!isNaN(createdDate.getTime())) {
                  // Only include if within the last 30 days
                  if (today.getTime() - createdDate.getTime() <= 30 * 24 * 60 * 60 * 1000) {
                    const dateStr = format(createdDate, 'MMM dd');
                    enrollmentByDay[dateStr] = (enrollmentByDay[dateStr] || 0) + 1;
                  }
                }
              } catch (e) {
                console.warn('Error parsing date:', dateValue, e);
              }
            }
          });
        } else {
          console.log('No date field found for enrollment tracking');
        }

        // Convert to array format for the chart
        const enrollmentData = Object.entries(enrollmentByDay)
          .map(([date, count]) => ({
            date,
            count,
          }))
          .sort((a, b) => {
            // Sort by date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });

        setEnrollmentData(enrollmentData);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [useMockData]);

  // Fetch data on component mount and when useMockData changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Toggle between mock and real data
  const toggleMockData = () => {
    setUseMockData(prev => !prev);
  };

  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalyticsData();
  };

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    const selected = timeRanges.find(range => range.value === value) || timeRanges[1];
    setSelectedRange(selected);
    // In a real implementation, you would refetch data based on the new time range
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Overview of your institution's performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Time Range:</span>
            <select
              value={selectedRange.value}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={toggleMockData}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                useMockData 
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {useMockData ? 'Using Mock Data' : 'Use Real Data'}
            </button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={FiUsers}
          trend="up"
          trendValue="12.5%"
          color="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Active Universities"
          value={activeUniversities}
          icon={FiAward}
          trend="up"
          trendValue="5.2%"
          color="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Top Country"
          value={topCountry || 'N/A'}
          icon={FiMapPin}
          trend="neutral"
          color="text-purple-600 dark:text-purple-400"
        />
        <StatsCard
          title="Avg. Processing Time"
          value={`${avgProcessingTime} days`}
          icon={FiClock}
          trend="down"
          trendValue="1.2%"
          color="text-yellow-600 dark:text-yellow-400"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Enrollment Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Students</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Student Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Student Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {studentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, 'Students']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend 
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: '20px',
                  }}
                  formatter={(value) => (
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Universities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Top Universities</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">By Student Count</span>
          </div>
          <div className="space-y-4">
            {topUniversities.map((university, index) => (
              <div key={university.name} className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{university.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{university.student_count.toLocaleString()} students</p>
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {university.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Countries */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Top Countries</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">By Student Count</span>
          </div>
          <div className="space-y-4">
            {countriesData.map((country) => (
              <div key={country.code} className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 mr-3">
                  {country.code}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{country.country}</span>
                    <span className="text-gray-500 dark:text-gray-400">{country.student_count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
