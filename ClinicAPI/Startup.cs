using DAL;
using DAL.Core;
using DAL.Models;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ClinicAPI.Authorization;
using ClinicAPI.Helpers;
using AppPermissions = DAL.Core.ApplicationPermissions;
using DAL.Core.Interfaces;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using System;
using Microsoft.IdentityModel.Logging;
using AutoMapper;

namespace ClinicAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _env = env;
            Configuration = configuration;
        }

        private readonly IWebHostEnvironment _env;
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration["ConnectionStrings:DefaultConnection"],
                    b => b.MigrationsAssembly("DrKhoaClinicApi")
                )
            );

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromHours(24);
                options.Lockout.MaxFailedAccessAttempts = 10;
            });

            services.AddIdentityServer()
               .AddDeveloperSigningCredential()
               .AddInMemoryPersistedGrants()
               .AddInMemoryIdentityResources(IdentityServerConfig.GetIdentityResources())
               .AddInMemoryApiResources(IdentityServerConfig.GetApiResources())
               .AddInMemoryClients(IdentityServerConfig.GetClients())
               .AddAspNetIdentity<User>()
               .AddProfileService<ProfileService>();

            var applicationUrl = Configuration["ApplicationUrl"].TrimEnd('/');

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                })
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = applicationUrl;
                    options.SupportedTokens = SupportedTokens.Jwt;
                    options.RequireHttpsMetadata = false; // Note: Set this for https in production
                    options.ApiName = IdentityServerConfig.ApiName;
                    options.JwtBackChannelHandler = IdentityServerConfig.GetJwtBackChannelHandler(); // Note: Use this in production
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ViewAllUsersPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewUsers));
                options.AddPolicy(Policies.ManageAllUsersPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManageUsers));

                options.AddPolicy(Policies.ViewAllRolesPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewRoles));
                options.AddPolicy(Policies.ManageAllRolesPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManageRoles));
                options.AddPolicy(Policies.AssignAllRolesPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.AssignRoles));

                options.AddPolicy(Policies.ViewAllPatientsPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewPatients));
                options.AddPolicy(Policies.ManageAllPatientsPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManagePatients));

                options.AddPolicy(Policies.ViewAllPrescriptionsPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewPrescriptions));
                options.AddPolicy(Policies.ManageAllPrescriptionsPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManagePrescriptions));

                options.AddPolicy(Policies.ViewAllMedicinesPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewMedicines));
                options.AddPolicy(Policies.ManageAllMedicinesPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManageMedicines));

                options.AddPolicy(Policies.ViewAllServiceFormsPolicy,
                   policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewServiceForms));
                options.AddPolicy(Policies.ManageAllServiceFormsPolicy,
                    policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManageServiceForms));
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "v1" });
                c.OperationFilter<AuthorizeCheckOperationFilter>();
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Password = new OpenApiOAuthFlow
                        {
                            TokenUrl = new Uri("/connect/token", UriKind.Relative),
                            Scopes = new Dictionary<string, string>()
                            {
                                { IdentityServerConfig.ApiName, IdentityServerConfig.ApiFriendlyName }
                            }
                        }
                    }
                });
            });

            services
                .AddControllers()
                .AddNewtonsoftJson(config => config.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            services.AddCors();

            services.AddAutoMapper(typeof(Startup));

            services.AddScoped<IUnitOfWork, HttpUnitOfWork>();

            services.AddScoped<IAccountManager, AccountManager>();

            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();

            IdentityModelEventSource.ShowPII = true; // Logging PII.
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            Utilities.ConfigureLogger(loggerFactory);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());

            app.UseIdentityServer();

            app.UseAuthorization();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.DocumentTitle = "Swagger UI - Clinic App";
                c.SwaggerEndpoint("/swagger/v1/swagger.json", $"{IdentityServerConfig.ApiFriendlyName} V1");
                c.OAuthClientId(IdentityServerConfig.SwaggerClientID);
                c.OAuthClientSecret("no_password");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
