import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import type { Subject, Grade } from '../../../types/entities';

interface GradeSidebarProps {
  subject: Subject;
  grade: Grade;
}

export function GradeSidebar({ subject, grade }: GradeSidebarProps) {
  const units = [...(grade.units || [])].sort((a, b) => a.orderIndex - b.orderIndex);
  
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  return (
    <aside className="sticky top-40 h-[80vh] overflow-y-auto border-r border-base-200 pr-4 hide-scrollbar">
      <div className="p-2 mb-2">
        <h2 className="text-2xl font-bold text-base-content">{subject.name}</h2>
        <p className="text-base text-primary mt-1 font-medium">{grade.name}</p>
      </div>

      <hr className="border-base-300 mb-4 mx-1" />
      
      {units.length === 0 ? (
        <p className="text-base text-base-content/60 italic p-2 text-center">
          Nenhuma unidade disponível para esta série.
        </p>
      ) : (
        <div className="flex flex-col gap-4 w-full px-2">
          {units.map((unit, index) => {
            const isExpanded = !!expandedUnits[unit.id];
            
            const lessons = [...(unit.lessons || [])].sort((a, b) => a.orderIndex - b.orderIndex);

            return (
              <div key={unit.id} className="flex flex-col">
                
                <div className="flex items-center justify-between group">
                  <Link
                    to="/materias/$subjectId/$gradeId/$unitId"
                    params={{ subjectId: subject.id, gradeId: grade.id, unitId: unit.id }}
                    className="flex-1 py-1 text-base text-base-content/80 transition-colors hover:text-primary group/link pr-2"
                    activeProps={{ className: 'text-primary font-bold' }}
                    onClick={() => setExpandedUnits((prev) => ({ ...prev, [unit.id]: true }))}
                  >
                    <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-2 line-clamp-2 leading-tight">
                      {index + 1}. {unit.title}
                    </span>
                  </Link>
                  
                  <button
                    type="button"
                    onClick={() => toggleUnit(unit.id)}
                    className={`p-1 shrink-0 transition-colors duration-200 
                      ${isExpanded ? 'text-primary' : 'text-base-content/40 hover:text-primary'}`}
                    title={isExpanded ? "Recolher aulas" : "Ver aulas"}
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    
                    <ul className="pl-4 flex flex-col gap-2 border-l-2 border-base-200 ml-2 mb-2">
                      {lessons.length === 0 ? (
                        <li className="text-sm text-base-content/50 italic py-1">
                          Nenhuma aula cadastrada.
                        </li>
                      ) : (
                        lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id}>
                            <Link
                              to="/materias/$subjectId/$gradeId/$unitId/$lessonId"
                              params={{ 
                                subjectId: subject.id, 
                                gradeId: grade.id, 
                                unitId: unit.id, 
                                lessonId: lesson.id 
                              }}
                              className="block py-1 text-base text-base-content/60 transition-all duration-300 hover:text-primary hover:translate-x-2 line-clamp-2 leading-tight"
                              activeProps={{ className: 'text-primary font-medium' }}
                            >
                              {lessonIndex + 1}. {lesson.title}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                    
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}