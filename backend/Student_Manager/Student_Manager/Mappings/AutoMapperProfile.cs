using System.Diagnostics;
using AutoMapper;
using Student_Manager.Model;
using Student_Manager.Model.DTO.Account;
using Student_Manager.Model.DTO.Course;
using Student_Manager.Model.DTO.Academic_Level;
using Student_Manager.Model.DTO.Student;
using Student_Manager.Model.Entities;
using Student_Manager.Model.DTO.Academic_Year;

namespace Student_Manager.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UpdateAccount, Account>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateCourse, Course>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateStudent, Student>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null || srcMember == null));

            CreateMap<UpdateAcademicLevel, Academic_Level>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateAcademicYear, Academic_Year>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}
