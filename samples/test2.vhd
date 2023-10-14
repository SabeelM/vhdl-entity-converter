LIBRARY IEEE;
USE IEEE.std_logic_1164.ALL;


ENTITY im_a_big_entity IS
    PORT (
        clk      : IN STD_ULOGIC;
        rst      : IN STD_ULOGIC;
        data_in  : IN STD_ULOGIC_VECTOR(3 DOWNTO 0)
    );
END ENTITY;

ARCHITECTURE rtl OF im_a_big_entity IS

BEGIN

END rtl;