LIBRARY IEEE;
USE IEEE.std_logic_1164.ALL;


ENTITY im_a_little_entity IS
    GENERIC (
        gSCALING_FACTOR  : INTEGER := 100;
        gCORE_EN         : BOOLEAN := TRUE
    );
    PORT (
        clk      : IN STD_ULOGIC;
        rst      : IN STD_ULOGIC;
        data_in  : IN STD_ULOGIC_VECTOR(3 DOWNTO 0);
        data_out : OUT INTEGER
    );
END ENTITY;