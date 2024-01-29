type AppCardProps = {
  children: React.ReactNode;
  highlighOnHover?: boolean;
};

export function AppCard({ children, highlighOnHover }: AppCardProps) {
  return (
    <>
      <section
        className={`w-full 
                  p-4 
                  border 
                  border-gray-300 
                  rounded-md 
                  shadow-md 
                  shadow-blue-300
                  ${highlighOnHover && "hover:bg-blue-200"}
                  `}
      >
        {children}
      </section>
    </>
  );
}
